import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
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

export const UserSchema = SchemaFactory.createForClass(User);
