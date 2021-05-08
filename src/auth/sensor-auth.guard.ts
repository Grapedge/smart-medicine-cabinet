import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SensorAuthGuard extends AuthGuard('sensor') {
  handleRequest(err, sensor, info) {
    if (err) {
      throw err;
    } else if (!sensor || info) {
      throw new UnauthorizedException('传感器认证失败', 'unauthorized_unknown');
    }
    return sensor;
  }
}
