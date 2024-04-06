import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/types/user.types';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;
}
