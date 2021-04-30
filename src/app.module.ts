import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { SensorModule } from './sensor/sensor.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MedicineModule } from './medicine/medicine.module';
import { AlarmModule } from './alarm/alarm.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DeviceModule,
    CabinetModule,
    SensorModule,
    UserModule,
    MedicineModule,
    AlarmModule,
    AuthModule,
  ],
})
export class AppModule {}
