import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from 'src/utils/security.utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });

    const createdUser = await newUser.save();

    return await createdUser.toObject();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find({}, { password: 0 }).lean().exec();
  }

  async findOneByEmail(
    email: string,
    includePassword?: boolean,
  ): Promise<User> {
    const user = await this.userModel
      .findOne({ email }, !includePassword && { password: 0 })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
