import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UserRole } from 'src/types/user.types';
import { Roles } from 'src/decorators/custom-decorators';
import { JoinClassDto } from './dto/join-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(UserRole.TEACHER)
  @Post('teacher-create')
  create(@Body() createClassDto: CreateClassDto, @Req() request) {
    const { sub } = request.jwtPayload;
    return this.classesService.createClass(createClassDto, sub);
  }

  @Roles(UserRole.TEACHER, UserRole.STUDENT)
  @Get()
  findAllClasses(@Req() request) {
    const { sub, role } = request.jwtPayload;

    if (role === UserRole.TEACHER) {
      return this.classesService.findAllByTeacher(sub);
    }

    return this.classesService.findClassesJoined(sub);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.classesService.getClassById(id);
  }

  @Roles(UserRole.STUDENT)
  @Post('student-join')
  async joinClassAsStudent(@Body() joinClassDto: JoinClassDto, @Req() request) {
    const { sub } = request.jwtPayload;
    const joinedClass = await this.classesService.joinClass(joinClassDto, sub);
    return {
      message: 'Successfully joined class.',
      class: joinedClass,
    };
  }
}
