import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { verifyPasswordHash } from 'src/utils/security.utils';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findOneByEmail(email, true);

    const isValidUser = await verifyPasswordHash(password, user.password);

    if (!isValidUser) {
      throw new UnauthorizedException('Incorrect password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: currentPassword, ...rest } = user;

    const jwtPayload = { profile: rest, sub: user.email };
    const token = await this.jwtService.signAsync(jwtPayload);

    return {
      user,
      token,
    };
  }
}
