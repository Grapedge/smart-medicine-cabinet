import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info) {
    if (err) {
      throw err;
    } else if (!user || info) {
      throw new UnauthorizedException('用户认证失败', 'unauthorized_unknown');
    }
    return user;
  }
}
