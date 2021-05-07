import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';

export function LocalAuth() {
  return applyDecorators(
    UseGuards(LocalAuthGuard),
    ApiUnauthorizedResponse({ description: '用户的手机号或密码不正确' }),
  );
}
