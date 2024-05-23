import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { customAlphabet } from 'nanoid';
import { JoinClassDto } from './dto/join-class.dto';
import { KindeClient } from 'src/client/kinde/kindeClient.service';
import { SupabaseClientService } from 'src/client/supabase/supabaseClient.service';
import {
  ClassWithRelatedData,
  ClassWithStudentsData,
  SchoolClass,
} from 'src/types/common.types';

@Injectable()
export class ClassesService {
  private readonly logger = new Logger(ClassesService.name);

  constructor(
    private readonly kindeClient: KindeClient,
    private readonly supabaseClient: SupabaseClientService,
  ) {}

  async createClass(
    createClassDto: CreateClassDto,
    teacherId: string,
  ): Promise<SchoolClass> {
    const { name } = createClassDto;
    const classCode = await this.generateUniqueClassCode();

    const supabase = this.supabaseClient.getClient();

    this.logger.log(
      `Creating class with name '${name}' for teacher id ${teacherId}`,
    );

    const { data: createdClass } = await supabase
      .from('SchoolClass')
      .insert({ className: name, classCode, teacherId })
      .select()
      .throwOnError();

    this.logger.log(
      `Successfully created class with id ${createdClass[0].id} and name ${createdClass[0].className} for teacher id ${createdClass[0].teacherId}`,
    );

    return createdClass[0];
  }

  async joinClass(joinClassDto: JoinClassDto, studentId: string) {
    const supabase = this.supabaseClient.getClient();
    const { classCode } = joinClassDto;

    const { data: foundClasses } = await supabase
      .from('SchoolClass')
      .select()
      .eq('classCode', classCode)
      .throwOnError();

    if (!foundClasses.length) {
      throw new NotFoundException(
        'Unable to find a class for provided classCode.',
        { description: 'NO_CLASS_FOUND_ERROR' },
      );
    }

    const foundClass = foundClasses[0];

    const student = await this.kindeClient.getUserById(studentId);

    try {
      const { data: createdMapping } = await supabase
        .from('ClassStudentMapping')
        .insert({
          studentId: student.id,
          studentEmail: student.preferredEmail,
          classId: foundClass.id,
        })
        .select()
        .throwOnError();

      this.logger.log(
        `Added student ${createdMapping[0].studentId} to class ${foundClass.id}`,
      );
    } catch (error: any) {
      if (error.message.includes('duplicate key value')) {
        throw new ConflictException('User is already enrolled in class.', {
          description: 'ALREADY_ENROLLED_ERROR',
        });
      }
      throw error;
    }
  }

  async getClassById(classId: string): Promise<ClassWithStudentsData> {
    const supabase = this.supabaseClient.getClient();
    const { data: classes } = await supabase
      .from('SchoolClass')
      .select('*, ClassStudentMapping(*)')
      .eq('id', classId)
      .throwOnError();

    if (!classes.length) {
      throw new NotFoundException(`Cannot find class with id: ${classId}`);
    }

    const foundClass = classes[0];

    const teacher = await this.kindeClient.getUserById(foundClass.teacherId);

    const studentEmailsWithoutData = foundClass.ClassStudentMapping.map(
      (item) => item.studentEmail,
    );

    const getUsersResponse = await this.kindeClient.getUsersByEmails(
      studentEmailsWithoutData,
    );

    const studentsWithData = studentEmailsWithoutData.map((studentEmail) => {
      const studentData = getUsersResponse.users.find(
        (user) => user.email === studentEmail,
      );
      return studentData;
    });

    return {
      ...foundClass,
      teacherDetails: teacher,
      studentCount: studentsWithData.length,
      students: studentsWithData,
    };
  }

  async getClassesByTeacher(
    teacherId: string,
  ): Promise<ClassWithRelatedData[]> {
    const supabase = this.supabaseClient.getClient();
    const { data: foundClasses } = await supabase
      .from('SchoolClass')
      .select('*, ClassStudentMapping(count)')
      .eq('teacherId', teacherId)
      .throwOnError();

    const classesWithTeachers = await Promise.all(
      foundClasses.map(async (item) => {
        const user = await this.kindeClient.getUserById(item.teacherId);
        return {
          ...item,
          teacherDetails: user,
          studentCount: item.ClassStudentMapping[0].count,
        };
      }),
    );

    return classesWithTeachers;
  }

  async getClassesJoined(studentId: string): Promise<ClassWithRelatedData[]> {
    const supabase = this.supabaseClient.getClient();

    const { data: joinedClasses } = await supabase
      .from('ClassStudentMapping')
      .select('*, SchoolClass (*)')
      .eq('studentId', studentId)
      .throwOnError();

    const classesWithTeachers = await Promise.all(
      joinedClasses.map(async (item) => {
        const teacher = await this.kindeClient.getUserById(
          item.SchoolClass.teacherId,
        );

        const studentsCount = await supabase
          .from('ClassStudentMapping')
          .select('*', { count: 'exact' })
          .eq('classId', item.classId)
          .throwOnError();
        return {
          ...item.SchoolClass,
          teacherDetails: teacher,
          studentCount: studentsCount.count,
        };
      }),
    );

    return classesWithTeachers;
  }

  private generateClassCode(): string {
    const prefixAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const suffixAlphabet = '0123456789';

    const codePrfix = customAlphabet(prefixAlphabet, 4)();
    const codeSuffix = customAlphabet(suffixAlphabet, 4)();

    return `${codePrfix}-${codeSuffix}`;
  }

  private async generateUniqueClassCode(): Promise<string> {
    const supabase = this.supabaseClient.getClient();
    const maxRetryCount = 5;

    for (let retries = 0; retries < maxRetryCount; retries++) {
      const classCode = this.generateClassCode();
      const { data: classesWithDuplicateCode } = await supabase
        .from('SchoolClass')
        .select()
        .eq('classCode', classCode)
        .throwOnError();

      if (!classesWithDuplicateCode.length) return classCode;
      this.logger.warn(
        `classCode ${classCode} is already in use. Generating a new classCode`,
      );
    }

    throw new InternalServerErrorException(
      'Unable to generate unique class code. Please try again.',
    );
  }
}
