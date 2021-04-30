import {
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @IsPhoneNumber('CN')
  @Length(11)
  @Matches(/^1[3-9]\d{9}$/)
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}

export class CreateUserRsp {
  id: string;
  name: string;
  phone: string;
}
