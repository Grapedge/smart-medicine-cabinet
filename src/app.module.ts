import { Module } from '@nestjs/common';
import { CabinetModule } from './cabinet/cabinet.module';
import { SensorModule } from './sensor/sensor.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MedicineModule } from './medicine/medicine.module';
import { AlarmModule } from './alarm/alarm.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import type { Configuration } from './config/configuration';
import type { DatabaseConfig } from './config/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigService],
      useFactory: async (configService: ConfigService<Configuration>) => {
        const databaseConfig = configService.get<DatabaseConfig>('database');
        // const { user, password, host, port, database } = databaseConfig;
        // const mongoDbUri = `mongodb://${user}:${password}@${host}:${port}/${database}`;
        const mongoDbUri = databaseConfig.url;
        return {
          uri: mongoDbUri,
          useCreateIndex: true,
          useFindAndModify: false,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
    CabinetModule,
    SensorModule,
    UserModule,
    MedicineModule,
    AlarmModule,
    AuthModule,
  ],
})
export class AppModule {}
