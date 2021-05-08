import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { AuthConfig } from 'src/config/auth.config';
import type { Configuration } from 'src/config/configuration';
import { SensorModule } from 'src/sensor/sensor.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { SensorStrategy } from './sensor-auth.strategy';

@Module({
  imports: [
    UserModule,
    SensorModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<Configuration>) => {
        const authConfig = configService.get<AuthConfig>('auth');
        return {
          secret: authConfig.secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, SensorStrategy],
})
export class AuthModule {}
