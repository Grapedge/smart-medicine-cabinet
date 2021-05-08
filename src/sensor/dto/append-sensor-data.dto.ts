import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AppendSensorDataDto {
  @IsNumber()
  @ApiProperty({
    description: '温度',
    example: 37,
  })
  temperature: number;

  @IsNumber()
  @ApiProperty({
    description: '湿度',
    example: 32,
  })
  humidity: number;
}
