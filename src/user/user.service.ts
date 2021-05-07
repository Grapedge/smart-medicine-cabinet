import * as sha256 from 'crypto-js/sha256';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import type { Configuration } from 'src/config/configuration';
import { ServerConfig } from 'src/config/server.config';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/core/enums/role.enum';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService<Configuration>,
  ) {}

  async onModuleInit() {
    const isExists = await this.userModel.findOne({
      role: Role.Admin,
    });
    if (isExists) return;
    const serverConfig = this.configService.get<ServerConfig>('server');
    await this.createOne({
      name: '管理员',
      phone: serverConfig.adminPhone,
      password: serverConfig.adminPassword,
      role: Role.Admin,
    });
  }

  async isExists(phone: string): Promise<boolean> {
    return this.userModel.exists(
      this.userModel.translateAliases({
        phone,
      }),
    );
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const signPass = sha256(createUserDto.password).toString();
    const user = new this.userModel({
      ...createUserDto,
      password: signPass,
    });
    await user.save();
    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    return this.userModel.findOne(
      this.userModel.translateAliases({
        phone,
      }),
    );
  }

  async removeOne(phone: string) {
    return this.userModel.deleteOne(
      this.userModel.translateAliases({
        phone,
      }),
    );
  }

  async updateOne(phone: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = sha256(updateUserDto.password).toString();
    }
    return this.userModel.findOneAndUpdate(
      this.userModel.translateAliases({
        phone,
      }),
      updateUserDto,
      {
        new: true,
      },
    );
  }

  /**
   * 查找用户，并验证给定密码是否正确
   * @param phone
   * @param password 密码明文
   * @returns
   */
  async findAndValidate(phone: string, password: string): Promise<User> {
    const signPass = sha256(password).toString();
    const user = await this.userModel.findOne(
      this.userModel.translateAliases({
        phone: phone,
        password: signPass,
      }),
    );
    return user;
  }
}
