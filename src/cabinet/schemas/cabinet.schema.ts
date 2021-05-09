import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import * as mongoose from 'mongoose';
@Schema()
export class AlarmLimit {
  @Prop({
    required: true,
    default: () => 35,
  })
  @ApiProperty()
  @IsNumber()
  temperature: number;

  @Prop({
    required: true,
    default: () => 50,
  })
  @ApiProperty()
  @IsNumber()
  humidity: number;
}

export type AlarmLimitDocuemnt = AlarmLimit & mongoose.Document;
export const AlarmLimitSchema = SchemaFactory.createForClass(AlarmLimit);

@Schema()
export class CabinetMedicineData {
  @Prop({
    required: true,
  })
  @ApiProperty()
  count: number;
  @Prop({
    required: true,
  })
  @ApiProperty()
  medicineId: string;
}

export const CabinetMedicineDataSchema = SchemaFactory.createForClass(
  CabinetMedicineData,
);
@Schema()
export class Cabinet {
  id: mongoose.ObjectId;

  @Prop({
    required: true,
    default: () => [],
  })
  sensor: string[];

  @Prop({
    default: () => ({}),
    type: Map,
    of: CabinetMedicineDataSchema,
  })
  medicine: Map<string, CabinetMedicineData>;

  @Prop({
    required: true,
    default: () => [],
  })
  user: string[];

  @Prop({
    required: true,
    default: () => ({}),
  })
  alarm: AlarmLimit;
}

export type CabinetDocumet = Cabinet & mongoose.Document;
export const CabinetSchema = SchemaFactory.createForClass(Cabinet);
