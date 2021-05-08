import { IsString } from 'class-validator';

export class BindUserDto {
  @IsString()
  phone: string;
}
