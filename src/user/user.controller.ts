import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, CreateUserRsp } from './dto/create-user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto): Promise<CreateUserRsp> {
    const user = await this.service.create(createUserDto);
    return {
      name: user.name,
      phone: user.phone,
    };
  }

  @Get(':id')
  async getUserInfo(@Param('id') id: string) {
    return;
  }
}
