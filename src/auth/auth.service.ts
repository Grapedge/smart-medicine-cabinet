import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthConfig } from 'src/config/auth.config';
import type { Configuration } from 'src/config/configuration';
import { Sensor } from 'src/sensor/schemas/sensor.schema';
import { SensorService } from 'src/sensor/sensor.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private authConfig: AuthConfig;

  constructor(
    private userService: UserService,
    private sensorService: SensorService,
    private jwtService: JwtService,
    configService: ConfigService<Configuration>,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  async validateUser(phone: string, password: string): Promise<User> {
    return this.userService.findAndValidate(phone, password);
  }

  async signAccessToken(user: User) {
    return this.jwtService.sign(
      {
        name: user.name,
        role: user.role,
      },
      {
        issuer: this.authConfig.issuer,
        subject: user.phone,
        secret: this.authConfig.secret,
        expiresIn: this.authConfig.accessTokenExpiresIn,
      },
    );
  }

  async signRefreshToken(phone: string) {
    return this.jwtService.sign(
      {},
      {
        issuer: this.authConfig.issuer,
        subject: phone,
        secret: this.authConfig.secret,
        expiresIn: this.authConfig.refreshTokenExpiresIn,
      },
    );
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findByPhone(payload.sub);
      return this.signAccessToken(user);
    } catch (error) {
      throw new UnauthorizedException(
        '刷新令牌无效或已经失效，请重新登录',
        'refresh_token_invalid',
      );
    }
  }

  async validateSensor(mac: string, secret: string): Promise<Sensor> {
    return this.sensorService.validateSensor(mac, secret);
  }
}
