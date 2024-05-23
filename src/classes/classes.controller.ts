import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UserRole } from 'src/types/user.types';
import { Roles } from 'src/decorators/custom-decorators';
import { JoinClassDto } from './dto/join-class.dto';
import { mapKindePermissionsToRole } from 'src/utils/roles.utils';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(UserRole.TEACHER)
  @Post('teacher-create')
  async create(@Body() createClassDto: CreateClassDto, @Req() request) {
    const { sub } = request.user;
    return await this.classesService.createClass(createClassDto, sub);
  }

  @Roles(UserRole.TEACHER, UserRole.STUDENT)
  @Get()
  async findAllClasses(@Req() request) {
    const { sub, permissions } = request.user;

    const role = mapKindePermissionsToRole(permissions);

    if (role === UserRole.TEACHER) {
      return await this.classesService.getClassesByTeacher(sub);
    }

    return this.classesService.getClassesJoined(sub);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.classesService.getClassById(id);
  }

  @Roles(UserRole.STUDENT)
  @Post('student-join')
  async joinClassAsStudent(@Body() joinClassDto: JoinClassDto, @Req() request) {
    const { sub } = request.user;
    await this.classesService.joinClass(joinClassDto, sub);
  }
}
