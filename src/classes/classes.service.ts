import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class } from 'src/schemas/class.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createClassDto: CreateClassDto, teacherDocId: string) {
    const teacher = await this.userModel.findById(teacherDocId).exec();

    const newClass = new this.classModel({
      ...createClassDto,
      teacher: teacher.toObject(),
    });

    const createdClass = await newClass.save();

    return createdClass;
  }

  async findAllByTeacher(teacherDocId: string) {
    return await this.classModel.find({ teacher: teacherDocId }).lean().exec();
  }
}
