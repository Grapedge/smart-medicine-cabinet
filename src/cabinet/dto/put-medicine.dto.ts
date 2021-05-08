import { IsMongoId, IsNumber } from 'class-validator';

export class PutMedicineDto {
  @IsMongoId()
  medicineId: string;

  // @IsNumber()
  // count: number;
}
