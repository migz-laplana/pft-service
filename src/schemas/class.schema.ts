import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  teacher: User;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
