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
  @ApiConflictResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const isExists = await this.userService.isExists(createUserDto.phone);
    if (isExists) throw new ConflictException('手机号已存在，不能重复添加');
    return this.userService.createOne(createUserDto);
  }

  @Delete(':phone')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async removeUser(@Param('phone') phone: string): Promise<RemoveOneRsp> {
    const isExists = await this.userService.isExists(phone);
    if (!isExists) throw new NotFoundException();
    await this.userService.removeOne(phone);
    return {
      deleted: phone,
    };
  }

  @Patch(':phone')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async updateUser(
    @CurUser() curUser: User,
    @Param('phone') phone: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    console.log(curUser.phone, phone);
    if (curUser.role === Role.User && curUser.phone !== phone) {
      throw new ForbiddenException();
    }
    const isExists = await this.userService.isExists(phone);
    if (!isExists) throw new NotFoundException();
    return this.userService.updateOne(phone, updateUserDto);
  }

  @Get(':phone')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async findUser(
    @CurUser() curUser: User,
    @Param('phone') phone: string,
  ): Promise<User> {
    if (curUser.role === Role.User && curUser.phone !== phone) {
      throw new ForbiddenException();
    }
    const isExists = await this.userService.isExists(phone);
    if (!isExists) throw new NotFoundException();
    return this.userService.findByPhone(phone);
  }
}
