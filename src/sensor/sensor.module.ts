import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sensor, SensorSchema } from './schemas/sensor.schema';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sensor.name,
        schema: SensorSchema,
      },
    ]),
  ],
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService],
})
export class SensorModule {}
