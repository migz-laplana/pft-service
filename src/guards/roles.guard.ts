import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/custom-decorators';
import { UserRole } from 'src/types/user.types';
import { mapKindePermissionsToRole } from 'src/utils/roles.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const roleFromJwt = mapKindePermissionsToRole(
      request.user.permissions as string[],
    );

    const hasAccess = requiredRoles.some((role) => roleFromJwt === role);

    if (!hasAccess) {
      throw new ForbiddenException(
        'User role does not have access to this resource.',
        { description: 'FORBIDDEN_ROLE_ERROR' },
      );
    }

    return true;
  }
}
