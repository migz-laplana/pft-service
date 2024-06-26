import { IsEnum, IsNotEmpty } from 'class-validator';
import { TestType } from 'src/types/fitnessTestResult.types';

export class GetFitnessTestResultDto {
  @IsNotEmpty({
    message: 'classId should be present in query string params',
  })
  classId: string;

  @IsNotEmpty({
    message: 'studentId should be present in query string params',
  })
  studentId: string;

  @IsNotEmpty({
    message: 'studentId should be present in query string params',
  })
  @IsEnum(TestType)
  testType: TestType;
}
