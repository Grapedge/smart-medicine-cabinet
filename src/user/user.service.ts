import * as sha256 from 'crypto-js/sha256';
import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import type { IUserInfo } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const phoneCount = await this.userModel.count({
      phone: createUserDto.phone,
    });
    if (phoneCount > 0) {
      throw new ConflictException('手机号已存在');
    }
    const signPass = sha256(createUserDto.password).toString();
    const user = new this.userModel({
      ...createUserDto,
      password: signPass,
    });
    await user.save();
    return user;
  }

  async findByPhone(phone: string): Promise<IUserInfo | null> {
    const user = await this.userModel.findOne({
      phone,
    });
    if (!user) return null;
    return {
      name: user.name,
      phone: user.phone,
    };
  }

  /**
   * 查找用户，并验证给定密码是否正确
   * @param phone
   * @param password 密码明文
   * @returns
   */
  async findAndValidate(
    phone: string,
    password: string,
  ): Promise<IUserInfo | null> {
    const signPass = sha256(password).toString();
    const user = await this.userModel.findOne({
      phone: phone,
      password: signPass,
    });
    return user || null;
  }
}
