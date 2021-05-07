import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth } from 'src/core/decorators/jwt-auth.decorator';
import { CurUser } from 'src/core/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiConflictResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const isExists = await this.userService.isExists(createUserDto.phone);
    if (isExists) {
      throw new ConflictException('手机号已存在');
    }
    const user = await this.userService.createOne(createUserDto);
    return user;
  }

  @Get('profile')
  @JwtAuth()
  @ApiOperation({
    description: '获取当前登录用户的用户信息',
  })
  async getProfile(@CurUser() { phone }: User): Promise<User> {
    return this.userService.findByPhone(phone);
  }

  @Get(':phone')
  @JwtAuth()
  @ApiNotFoundResponse()
  async findUser(@Param('phone') phone: string): Promise<User> {
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}
