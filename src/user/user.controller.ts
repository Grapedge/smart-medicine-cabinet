import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/core/decorators/jwt-auth.decorator';
import { CurUser } from 'src/core/decorators/user.decorator';
import { CreateUserDto, CreateUserRsp } from './dto/create-user.dto';
import { GetUserInfoRsp } from './dto/get-user-info.dto';
import type { IUserInfo } from './user.interface';
import { UserService } from './user.service';

@ApiTags('用户')
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  async register(@Body() createUserDto: CreateUserDto): Promise<CreateUserRsp> {
    const user = await this.userService.create(createUserDto);
    return {
      name: user.name,
      phone: user.phone,
    };
  }

  @Get('/users/:phone')
  @JwtAuth()
  async getUserInfo(@Param('phone') phone: string): Promise<GetUserInfoRsp> {
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('用户不存在', 'user_not_found');
    }
    return user;
  }

  @Get('/user')
  @JwtAuth()
  getSelf(@CurUser() user: IUserInfo): GetUserInfoRsp {
    return user;
  }
}
