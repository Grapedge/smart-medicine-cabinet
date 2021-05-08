import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindManyDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    type: Number,
  })
  current = 1;

  @IsOptional()
  @IsNumber()
  @Max(1000)
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    type: Number,
  })
  pageSize = 10;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      '选择要进行排序的字段，格式：key:asc 或 key:desc，如果要进行多个字段排序，中间使用英文逗号,分隔',
    example: 'updatedAt:desc',
  })
  sort?: string;
}

export class FindManyRsp {
  @ApiProperty({
    example: 120,
  })
  total: number;

  @ApiProperty({
    minimum: 1,
    default: 1,
    example: 1,
  })
  current: number;

  @ApiProperty({
    maximum: 1000,
    default: 10,
  })
  pageSize: number;
}
