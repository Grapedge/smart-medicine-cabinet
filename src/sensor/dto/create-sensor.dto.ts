import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSensorDto {
  @IsString()
  @ApiProperty({
    description: '传感器的物理MAC地址',
    example: 'abc.abc.abc',
  })
  mac: string;

  @IsString()
  @ApiProperty({
    example: '一号柜的传感器',
  })
  name: string;
}

export class CreateSensorRsp {
  mac: string;
  name: string;
  secret: string;
}
