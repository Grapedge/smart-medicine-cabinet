import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, CreateUserRsp } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  @Post()
  async register(@Body() dto: CreateUserDto): Promise<CreateUserRsp> {
    // TODO
    return {} as any;
  }

  @Get(':id')
  async getUserInfo(@Param('id') id: string) {
    return;
  }
}
