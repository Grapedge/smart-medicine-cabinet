import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { IUser } from '../user.interface';

export class CreateUserDto {
  @ApiProperty({
    example: '李华',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @IsPhoneNumber('CN')
  @Length(11)
  @Matches(/^1[3-9]\d{9}$/)
  @ApiProperty({
    example: '13311112222',
  })
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @ApiProperty()
  password: string;
}

export class CreateUserRsp implements IUser {
  name: string;
  phone: string;
}
