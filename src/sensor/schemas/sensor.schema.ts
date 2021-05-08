import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema()
export class SensorData {
  @Prop({
    required: true,
  })
  @ApiProperty()
  temperature: number;

  @Prop({
    required: true,
  })
  @ApiProperty()
  humidity: number;

  @Prop({
    required: true,
    default: () => new Date(),
  })
  @ApiProperty()
  createdAt: Date;
}

export type SensorDataDocument = SensorData & Document;
export const SensorDataSchema = SchemaFactory.createForClass(SensorData);

@Schema({
  toJSON: {
    transform: (_, sensor) => ({
      mac: sensor._id,
      name: sensor.name,
    }),
  },
})
export class Sensor {
  @Prop({
    alias: 'mac',
  })
  _id?: string;

  @ApiProperty({
    description: 'MAC 地址',
    example: 'abcd',
  })
  mac: string;

  @Prop({
    required: true,
  })
  @ApiProperty({
    description: '传感器名称',
    example: '一号传感器',
  })
  name: string;

  @Prop({
    required: true,
    default: () => nanoid(),
    select: false,
  })
  secret: string;

  @Prop({
    required: true,
    default: [],
    type: [SensorDataSchema],
  })
  data: Types.DocumentArray<SensorDataDocument>;
}

export type SensorDocument = Sensor & Document;

export const SensorSchema = SchemaFactory.createForClass(Sensor);
