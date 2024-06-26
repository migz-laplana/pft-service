import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateFitnessTestResultDto } from './dto/create-fitness-test-result.dto';
import { UpdateFitnessTestResultDto } from './dto/update-fitness-test-result.dto';
import { SupabaseClientService } from 'src/client/supabase/supabaseClient.service';
import { TestType } from 'src/types/fitnessTestResult.types';

@Injectable()
export class FitnessTestResultService {
  private readonly logger = new Logger(FitnessTestResultService.name);

  constructor(private readonly supabaseClient: SupabaseClientService) {}

  async create(createFitnessTestResultDto: CreateFitnessTestResultDto) {
    const { studentId, classId, testType } = createFitnessTestResultDto;

    const supabase = this.supabaseClient.getClient();

    this.logger.log(
      `Initializing fitness test submission for studentId: ${studentId} of classId: ${classId} of testType: ${testType}`,
    );

    const { data: createdTest } = await supabase
      .from('FitnessTest')
      .insert({ studentId, classId, testType })
      .select()
      .throwOnError();

    this.logger.log(
      `Created fitness test with id ${createdTest[0].id}, studentId ${createdTest[0].studentId}, classId ${createdTest[0].classId}, testType: ${createdTest[0].testType}`,
    );

    return createdTest[0];
  }

  findAll() {
    return `This action returns all fitnessTestResult`;
  }

  async findOne(id: number) {
    const supabase = this.supabaseClient.getClient();
    const { data: foundTest } = await supabase
      .from('FitnessTest')
      .select()
      .eq('id', id)
      .throwOnError();

    return foundTest[0];
  }

  async findByStudentAndClass(
    studentId: string,
    classId: number,
    testType: TestType,
  ) {
    const supabase = this.supabaseClient.getClient();
    const { data: foundTest } = await supabase
      .from('FitnessTest')
      .select()
      .eq('studentId', studentId)
      .eq('classId', classId)
      .eq('testType', testType)
      .throwOnError();

    if (!foundTest.length) {
      throw new NotFoundException(
        `Cannot find fitness test record for studentId: ${studentId} and classId: ${classId}`,
        {
          description: 'FITNESS_TEST_NOT_FOUND_ERROR',
        },
      );
    }
    return foundTest[0];
  }

  async update(
    id: number,
    updateFitnessTestResultDto: UpdateFitnessTestResultDto,
  ) {
    const supabase = this.supabaseClient.getClient();

    const { data: existingTest } = await supabase
      .from('FitnessTest')
      .select()
      .eq('id', id)
      .throwOnError();

    if (!existingTest.length) {
      throw new NotFoundException(`Cannot find fitness test with id ${id}`);
    }
    const { data: updatedTest } = await supabase
      .from('FitnessTest')
      .update(updateFitnessTestResultDto)
      .eq('id', id)
      .select()
      .throwOnError();

    if (!updatedTest.length) {
      return existingTest[0];
    }

    let loggerMessage = `Updated fitnessTest of id: ${id} with values = `;
    const keyValuePairs = Object.entries(updateFitnessTestResultDto)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    loggerMessage += keyValuePairs;
    this.logger.log(loggerMessage);

    return updatedTest[0];
  }

  remove(id: number) {
    return `This action removes a #${id} fitnessTestResult`;
  }

  async submitTestResult(id: number) {
    const supabase = this.supabaseClient.getClient();

    const { data: existingTest } = await supabase
      .from('FitnessTest')
      .select()
      .eq('id', id)
      .throwOnError();

    if (!existingTest.length) {
      throw new NotFoundException(`Cannot find fitness test with id ${id}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isSubmitted, ...rest } = existingTest[0];

    const noEmptyValues = Object.values(rest).every((testValue) => testValue);
    console.log(Object.values(rest));

    if (!noEmptyValues) {
      throw new ConflictException(
        `Fitness test with id ${id} has some empty or null values`,
      );
    }

    const { data: submittedTest } = await supabase
      .from('FitnessTest')
      .update({ isSubmitted: true })
      .eq('id', id)
      .select()
      .throwOnError();

    this.logger.log(`Submitted test with id ${id}`);

    return submittedTest[0];
  }
}
