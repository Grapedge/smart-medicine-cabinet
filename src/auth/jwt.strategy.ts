import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Configuration } from 'src/config/configuration';
import type { AuthConfig } from 'src/config/auth.config';
import type { IUserInfo } from 'src/user/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<Configuration>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AuthConfig>('auth').secret,
    });
  }

  async validate(payload: any): Promise<IUserInfo> {
    return { phone: payload.sub, name: payload.name };
  }
}
