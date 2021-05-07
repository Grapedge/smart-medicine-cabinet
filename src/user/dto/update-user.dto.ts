import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/core/enums/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: '李华',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @ApiPropertyOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiPropertyOptional({
    enum: Role,
    description: '用户类型，1 是普通用户，2是管理员',
  })
  role?: Role = Role.User;
}
