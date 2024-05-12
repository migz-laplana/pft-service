import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  classCode: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  teacher: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  students: User[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
