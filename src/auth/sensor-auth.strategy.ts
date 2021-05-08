import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SensorStrategy extends PassportStrategy(BasicStrategy, 'sensor') {
  constructor(private authService: AuthService) {
    super({});
  }

  async validate(mac: string, secret: string) {
    const sensor = await this.authService.validateSensor(mac, secret);
    if (!sensor) {
      throw new UnauthorizedException('传感器需要传递密钥以验证身份');
    }
    return sensor;
  }
}
