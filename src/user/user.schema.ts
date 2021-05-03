import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import type { IUserInfo } from './user.interface';

@Schema()
export class User implements IUserInfo {
  @Prop({
    required: true,
    length: 11,
    match: /^1[3-9]\d{9}$/,
    unique: true,
  })
  phone: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 20,
  })
  name: string;

  @Prop({
    required: true,
  })
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
