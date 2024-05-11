import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';

import { UserRole } from 'src/types/user.types';
import { Roles } from 'src/decorators/custom-decorators';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createClassDto: CreateClassDto, @Req() request) {
    const { sub } = request.jwtPayload;
    return this.classesService.create(createClassDto, sub);
  }

  @Roles(UserRole.TEACHER)
  @Get()
  findAllByTeacher(@Req() request) {
    const { sub } = request.jwtPayload;
    return this.classesService.findAllByTeacher(sub);
  }
}
