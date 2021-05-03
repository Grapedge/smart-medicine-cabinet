import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone',
    });
  }

  async validate(phone: string, password: string) {
    const user = await this.authService.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException(
        '手机号或密码错误',
        'invalid_phone_password',
      );
    }
    return user;
  }
}
