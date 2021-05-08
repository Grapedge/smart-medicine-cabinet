import { IsString } from 'class-validator';

export class BindSensorDto {
  @IsString()
  mac: string;
}
