import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { Document } from 'mongoose';
import { Role } from 'src/core/enums/role.enum';

@Schema({
  toJSON: {
    transform: (_, user) => ({
      phone: user._id,
      name: user.name,
      role: user.role,
    }),
  },
})
export class User {
  @Prop({
    length: 11,
    match: /^1[3-9]\d{9}$/,
    alias: 'phone',
  })
  _id?: string;

  @ApiProperty({
    example: '13311112222',
  })
  phone: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 20,
  })
  @ApiProperty({
    example: '李华',
  })
  name: string;

  @Prop({
    required: true,
    select: false,
    index: true,
  })
  password?: string;

  @Prop({
    required: true,
    default: Role.User,
  })
  @ApiProperty({
    enum: Role,
  })
  role: Role;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
