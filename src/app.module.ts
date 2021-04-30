import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { SensorModule } from './sensor/sensor.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { MedicineModule } from './medicine/medicine.module';
import { AlarmModule } from './alarm/alarm.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DeviceModule,
    CabinetModule,
    SensorModule,
    ConfigModule,
    UserModule,
    MedicineModule,
    AlarmModule,
    AuthModule,
  ],
})
export class AppModule {}
