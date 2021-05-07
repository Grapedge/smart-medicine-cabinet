import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Configuration } from 'src/config/configuration';
import type { AuthConfig } from 'src/config/auth.config';
import type { User } from 'src/user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<Configuration>) {
    const authConfig = configService.get<AuthConfig>('auth');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    return {
      phone: payload.sub,
      name: payload.name,
    };
  }
}
