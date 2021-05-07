import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { modelToObject } from 'src/core/utils/model-to-object';

@Schema({
  timestamps: true,
  toJSON: {
    transform: modelToObject,
  },
})
export class Medicine {
  @ApiProperty({
    example: '6093fe94705ee27eb6d3de33',
  })
  id: string;

  @Prop({
    required: true,
    maxlength: 100,
  })
  @ApiProperty({
    example: '右美沙芬愈创甘油醚糖浆',
  })
  name: string; // 药品名

  @Prop({
    required: true,
  })
  @ApiProperty({
    example: '用于治疗慢性支气管炎',
  })
  summary: string; // 药品简介

  @Prop()
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  updatedAt: Date;
}

export type MedicineDocument = Medicine & Document;

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
