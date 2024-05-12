import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { customAlphabet } from 'nanoid';
import { JoinClassDto } from './dto/join-class.dto';

@Injectable()
export class ClassesService {
  private readonly logger = new Logger(ClassesService.name);

  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createClass(createClassDto: CreateClassDto, teacherDocId: string) {
    const teacher = await this.userModel.findById(teacherDocId).exec();

    const classCode = await this.generateUniqueClassCode();

    const newClass = new this.classModel({
      ...createClassDto,
      teacher: teacher.toObject(),
      classCode,
    });

    const createdClass = await newClass.save();

    this.logger.log(
      `Successfully created class with id ${createdClass._id} and name ${createdClass.name} for teacher ${teacher._id}`,
    );

    return createdClass;
  }

  async joinClass(joinClassDto: JoinClassDto, studentId: string) {
    const { classCode } = joinClassDto;
    const foundClass = await this.classModel
      .findOne({ classCode })
      .populate('teacher')
      .exec();

    if (!foundClass) {
      throw new NotFoundException(
        'Unable to find a class for provided classCode.',
        { description: 'NO_CLASS_FOUND_ERROR' },
      );
    }

    const foundStudent = await this.userModel.findById(studentId);
    if (!foundStudent) {
      throw new UnauthorizedException('Current user not found in records.');
    }

    const isStudentAlreadyJoined = !!(await this.classModel.findOne({
      students: foundStudent._id,
      classCode,
    }));
    if (isStudentAlreadyJoined) {
      throw new ConflictException('You are already enrolled in this class.', {
        description: 'ALREADY_ENROLLED_ERROR',
      });
    }

    foundClass.students.push(foundStudent);
    await foundClass.save();
    this.logger.log(
      `Added student ${foundStudent._id} to class ${foundClass._id}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { students, ...classDetails } = foundClass.toObject();

    return { ...classDetails };
  }

  async getClassById(classId: string) {
    const foundClass = await this.classModel
      .findById(classId)
      .populate('students')
      .exec();

    if (!foundClass) {
      throw new NotFoundException(`Cannot find class with id: ${classId}`);
    }
    return foundClass;
  }

  async findAllByTeacher(teacherDocId: string) {
    const foundClasses = await this.classModel
      .find({ teacher: teacherDocId })
      .populate('teacher')
      .exec();

    const result = await this.autofillMissingClassCodesToClasses(
      foundClasses,
      teacherDocId,
    );
    return result;
  }

  async findClassesJoined(studentId: string) {
    const foundClasses = await this.classModel
      .find({ students: studentId })
      .populate('teacher')
      .exec();

    return foundClasses;
  }

  private async autofillMissingClassCodesToClasses(
    classModels: ClassDocument[],
    teacherId: string,
  ) {
    const classesWithoutClassCode = classModels.filter(
      (foundClass) => !foundClass.classCode,
    );

    if (!classesWithoutClassCode.length)
      return classModels.map((foundClass) => foundClass.toObject());

    this.logger.warn(
      `Found classes without class code. Generating class codes for ${classesWithoutClassCode.length} classes`,
    );

    for (const foundClass of classesWithoutClassCode) {
      const code = await this.generateUniqueClassCode();
      this.logger.log(`setting classCode ${code} for class ${foundClass._id}`);
      foundClass.classCode = code;
      await foundClass.save();
    }

    const classesWithUpdatedCodes = await this.classModel
      .find({ teacher: teacherId })
      .populate('teacher')
      .exec();

    this.logger.log('Returning classes with filled classCode values');

    return classesWithUpdatedCodes;
  }

  private generateClassCode(): string {
    const prefixAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const suffixAlphabet = '0123456789';

    const codePrfix = customAlphabet(prefixAlphabet, 4)();
    const codeSuffix = customAlphabet(suffixAlphabet, 4)();

    return `${codePrfix}-${codeSuffix}`;
  }

  private async generateUniqueClassCode(): Promise<string> {
    const maxRetryCount = 5;

    for (let retries = 0; retries < maxRetryCount; retries++) {
      const classCode = this.generateClassCode();
      const isDuplicate = await this.classModel.findOne({ classCode });

      if (!isDuplicate) return classCode;
      this.logger.warn(
        `classCode ${classCode} is already in use. Generating a new classCode`,
      );
    }

    throw new InternalServerErrorException(
      'Unable to generate unique class code. Please try again.',
    );
  }
}
