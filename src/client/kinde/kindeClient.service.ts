import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  Configuration,
  GetUsersRequest,
  GrantType,
  UsersApi,
  createKindeServerClient,
} from '@kinde-oss/kinde-typescript-sdk';
import { sessionManager } from 'src/session/session-manager';

@Injectable()
export class KindeClient {
  private apiInstance: UsersApi;
  private token: string;
  private readonly logger = new Logger(KindeClient.name);

  private async initialize() {
    if (this.apiInstance) return;

    const kindeApiClient = createKindeServerClient(
      GrantType.CLIENT_CREDENTIALS,
      {
        authDomain: process.env.KINDE_AUTH_DOMAIN,
        clientId: process.env.KINDE_CLIENT_ID,
        clientSecret: process.env.KINDE_CLIENT_SECRET,
        audience: `${process.env.KINDE_AUTH_DOMAIN}/api`,
        scope: '',
        logoutRedirectURL: '',
      },
    );

    this.token = await kindeApiClient.getToken(sessionManager);
    sessionManager.setSessionItem('token', this.token);

    const config = new Configuration({
      accessToken: this.token,
      basePath: process.env.KINDE_AUTH_DOMAIN,
      headers: { Accept: 'application/json' },
    });

    this.apiInstance = new UsersApi(config);
  }

  async getUserById(userId: string) {
    await this.initialize();

    const user = await this.apiInstance.getUserData({ id: userId });

    if (!user) {
      this.logger.error(`Could not find user data for kinde id ${userId}`);
      throw new NotFoundException('User not found in records.', {
        description: 'KINDE_USER_NOT_FOUND_ERROR',
      });
    }
    return user;
  }

  async getUsersByEmails(emails: string[], pageSize = 1000000000) {
    await this.initialize();

    const emailsString = emails.join(',');

    const payload: GetUsersRequest = {
      ...(emailsString && { email: emailsString }),
      pageSize,
    };

    const users = await this.apiInstance.getUsers(payload);

    return users;
  }
}
