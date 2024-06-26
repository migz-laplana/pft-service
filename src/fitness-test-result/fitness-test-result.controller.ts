import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { FitnessTestResultService } from './fitness-test-result.service';
import { CreateFitnessTestResultDto } from './dto/create-fitness-test-result.dto';
import { UpdateFitnessTestResultDto } from './dto/update-fitness-test-result.dto';
import { UserRole } from 'src/types/user.types';
import { Roles } from 'src/decorators/custom-decorators';
import { GetFitnessTestResultDto } from './dto/get-fitness-test-result.dto';

@Controller('fitness-test-result')
export class FitnessTestResultController {
  constructor(
    private readonly fitnessTestResultService: FitnessTestResultService,
  ) {}

  @Roles(UserRole.STUDENT)
  @Post()
  create(@Body() createFitnessTestResultDto: CreateFitnessTestResultDto) {
    return this.fitnessTestResultService.create(createFitnessTestResultDto);
  }

  // @Get()
  // findAll() {
  //   return this.fitnessTestResultService.findAll();
  // }

  @Roles(UserRole.STUDENT, UserRole.TEACHER)
  @Get()
  findByStudentAndClass(
    @Query()
    query: GetFitnessTestResultDto,
  ) {
    return this.fitnessTestResultService.findByStudentAndClass(
      query.studentId,
      parseInt(query.classId, 10),
      query.testType,
    );
  }

  @Roles(UserRole.STUDENT)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateFitnessTestResultDto: UpdateFitnessTestResultDto,
  ) {
    return this.fitnessTestResultService.update(id, updateFitnessTestResultDto);
  }

  @Roles(UserRole.STUDENT)
  @Post(':id/submit')
  submitTest(@Param('id') id: number) {
    return this.fitnessTestResultService.submitTestResult(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.fitnessTestResultService.remove(+id);
  // }
}
