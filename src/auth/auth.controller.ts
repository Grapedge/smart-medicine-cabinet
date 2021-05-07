import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/core/decorators/jwt-auth.decorator';
import { User } from 'src/user/user.schema';
import { CurUser } from '../core/decorators/user.decorator';
import { AuthService } from './auth.service';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { SignInDto, SignInRsp } from './dto/sign-in.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
@ApiTags('身份认证')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiResponse({
    status: 401,
    description: '用户认证失败、用户手机不存在、用户密码错误',
  })
  async signIn(
    @CurUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: SignInDto,
  ): Promise<SignInRsp> {
    const accessToken = await this.authService.signAccessToken(user);
    const refreshToken = await this.authService.signRefreshToken(user.phone);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  async refreshAccessToken(
    @Body() refreshDto: RefreshAccessTokenDto,
  ): Promise<SignInRsp> {
    const { refreshToken } = refreshDto;
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  @JwtAuth()
  @Get('user')
  @ApiOperation({
    description:
      '简单返回当前登录用户的手机号与名称，仅用作判断身份是否已验证使用',
  })
  async protectedUser(@CurUser() user) {
    return user;
  }
}
