import { User, UsersResponseUsersInner } from '@kinde-oss/kinde-typescript-sdk';

export type SchoolClass = {
  id: number;
  created_at: string;
  classCode: string;
  className: string;
  teacherId: string;
};

export type ClassWithRelatedData = SchoolClass & {
  teacherDetails: User;
  studentCount: number;
};

export type ClassWithStudentsData = ClassWithRelatedData & {
  students: UsersResponseUsersInner[];
};
