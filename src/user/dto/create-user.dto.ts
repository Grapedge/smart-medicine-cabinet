import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/core/enums/role.enum';

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

  @IsEnum(Role)
  @IsOptional()
  @ApiPropertyOptional({
    enum: Role,
    description: '用户类型，1 是普通用户，2是管理员',
  })
  role: Role = Role.User;
}
