import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/core/decorators/jwt-auth.decorator';
import { User } from 'src/user/schemas/user.schema';
import { CurUser } from '../core/decorators/user.decorator';
import { AuthService } from './auth.service';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { SignInDto, SignInRsp } from './dto/sign-in.dto';
import { LocalAuth } from './local-auth.decorator';

@Controller('auth')
@ApiTags('身份认证')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @LocalAuth()
  @ApiOperation({
    description: '登录系统',
  })
  @ApiBody({
    type: SignInDto,
  })
  async signIn(@CurUser() user: User): Promise<SignInRsp> {
    const accessToken = await this.authService.signAccessToken(user);
    const refreshToken = await this.authService.signRefreshToken(user.phone);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  @ApiOperation({
    description:
      '当用户 accessToken 失效后，使用刷新令牌进行获取新的 accessToken',
  })
  @ApiBody({
    type: RefreshAccessTokenDto,
  })
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<SignInRsp> {
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  @JwtAuth()
  @Get('test-jwt')
  @ApiOperation({
    description:
      '简单返回当前登录用户的手机号与名称，仅用作判断身份是否已验证使用',
  })
  async testJwt(@CurUser() user) {
    return user;
  }
}
