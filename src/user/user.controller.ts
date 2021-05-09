import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { CurUser } from 'src/core/decorators/user.decorator';
import { RemoveOneRsp } from 'src/core/dto/remove.dto';
import { Role } from 'src/core/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】创建用户',
  })
  @ApiConflictResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const isExists = await this.userService.isExists(createUserDto.phone);
    if (isExists) throw new ConflictException('手机号已存在，不能重复添加');
    return this.userService.createOne(createUserDto);
  }

  @Delete(':phone')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】删除用户',
  })
  @ApiNotFoundResponse()
  async removeUser(@Param('phone') phone: string): Promise<RemoveOneRsp> {
    const user = await this.userService.removeOne(phone);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      deleted: phone,
    };
  }

  @Patch(':phone')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '更新用户信息',
    description: '普通用户仅能更新自己的信息，role 字段仅管理员生效',
  })
  @ApiNotFoundResponse()
  async updateUser(
    @CurUser() curUser: User,
    @Param('phone') phone: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (curUser.role === Role.User) {
      updateUserDto.role = curUser.role;
    }
    if (curUser.role === Role.User && curUser.phone !== phone) {
      throw new ForbiddenException();
    }
    const user = await this.userService.updateOne(phone, updateUserDto);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get(':phone')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '查找用户',
    description: '普通用户仅能查看自己的用户信息',
  })
  @ApiNotFoundResponse()
  async findUser(
    @CurUser() curUser: User,
    @Param('phone') phone: string,
  ): Promise<User> {
    if (curUser.role === Role.User && curUser.phone !== phone) {
      throw new ForbiddenException();
    }
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
