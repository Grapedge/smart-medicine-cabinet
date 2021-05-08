import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineModule } from 'src/medicine/medicine.module';
import { SensorModule } from 'src/sensor/sensor.module';
import { UserModule } from 'src/user/user.module';
import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';
import { Cabinet, CabinetSchema } from './schemas/cabinet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cabinet.name,
        schema: CabinetSchema,
      },
    ]),
    SensorModule,
    UserModule,
    MedicineModule,
  ],
  controllers: [CabinetController],
  providers: [CabinetService],
})
export class CabinetModule {}
