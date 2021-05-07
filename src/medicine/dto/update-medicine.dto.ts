import { IsString } from 'class-validator';

export class UpdateMedicineDto {
  @IsString()
  name: string;

  @IsString()
  summary: string;
}
