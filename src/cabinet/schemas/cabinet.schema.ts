import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Medicine } from 'src/medicine/schemas/medicine.schema';
import { Sensor } from 'src/sensor/schemas/sensor.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class AlarmLimit {
  @Prop({
    required: true,
    default: () => 35,
  })
  temperature: number;

  @Prop({
    required: true,
    default: () => 50,
  })
  humidity: number;
}

export type AlarmLimitDocuemnt = AlarmLimit & mongoose.Document;
export const AlarmLimitSchema = SchemaFactory.createForClass(AlarmLimit);

@Schema()
export class Cabinet {
  @Prop({
    required: true,
    default: () => [],
    type: [
      {
        ref: Sensor.name,
        type: String,
      },
    ],
  })
  sensor: Sensor[];

  @Prop({
    required: true,
    default: () => [],
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Medicine.name,
      },
    ],
  })
  medicine: Medicine[];

  @Prop({
    required: true,
    default: () => [],
    type: [
      {
        type: String,
        ref: User.name,
      },
    ],
  })
  user: User[];

  @Prop({
    required: true,
    default: () => ({}),
  })
  alarm: AlarmLimit;
}

export type CabinetDocumet = Cabinet & mongoose.Document;
export const CabinetSchema = SchemaFactory.createForClass(Cabinet);
