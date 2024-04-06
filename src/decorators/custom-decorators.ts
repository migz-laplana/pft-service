import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/types/user.types';

export const IS_PUBLIC_KEY = 'isPublic';
export const AllowAnon = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
