import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/decorators/custom-decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicEndpoint = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublicEndpoint) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token =
      request.cookies[`pft-session-${process.env.ENV.toLowerCase()}`];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_CONSTANTS_SECRET,
      });

      request['jwtPayload'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
