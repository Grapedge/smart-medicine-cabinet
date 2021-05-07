import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';
import { Medicine, MedicineSchema } from './schemas/medicine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Medicine.name,
        schema: MedicineSchema,
      },
    ]),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
