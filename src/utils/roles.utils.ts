import { UserRole } from 'src/types/user.types';

export const mapKindePermissionsToRole = (permissions: string[]): UserRole => {
  if (permissions[0] === 'teacher') return UserRole.TEACHER;
  return UserRole.STUDENT;
};
