import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMedicineDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MaxLength(200)
  summary: string;
}
