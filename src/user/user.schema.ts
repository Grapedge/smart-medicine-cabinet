import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { Document } from 'mongoose';

@Schema({
  toJSON: {
    transform: (_, user) => ({
      phone: user.phone,
      name: user.name,
    }),
  },
})
export class User {
  @ApiProperty({
    example: '13311112222',
  })
  @Prop({
    required: true,
    length: 11,
    match: /^1[3-9]\d{9}$/,
    unique: true,
  })
  phone: string;

  @ApiProperty({
    example: '李华',
  })
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 20,
  })
  name: string;

  @Prop({
    required: true,
    select: false,
  })
  password?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
