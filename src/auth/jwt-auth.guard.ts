import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err) {
      throw err;
    } else if (info) {
      if (info.message === 'No auth token') {
        throw new UnauthorizedException('用户没有携带有效的令牌', info.message);
      }
      throw new UnauthorizedException('用户令牌过期或无效', info.message);
    }
    return user;
  }
}
