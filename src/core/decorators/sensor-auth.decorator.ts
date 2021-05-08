import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SensorAuthGuard } from 'src/auth/sensor-auth.guard';

export function SensorAuth() {
  return applyDecorators(
    UseGuards(SensorAuthGuard),
    ApiBasicAuth(),
    ApiUnauthorizedResponse({ description: '传感器认证失败' }),
  );
}
