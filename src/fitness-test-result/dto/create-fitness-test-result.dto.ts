import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TestType } from 'src/types/fitnessTestResult.types';
import { UpdateFitnessTestResultDto } from './update-fitness-test-result.dto';

export class CreateFitnessTestResultDto extends UpdateFitnessTestResultDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsInt()
  @IsNotEmpty()
  classId: number;

  @IsEnum(TestType)
  @IsNotEmpty()
  testType: TestType;
}
