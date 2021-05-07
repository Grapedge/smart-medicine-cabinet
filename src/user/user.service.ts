import * as sha256 from 'crypto-js/sha256';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async isExists(phone: string): Promise<boolean> {
    return this.userModel.exists({
      phone,
    });
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
    return this.userModel.findOne({
      phone,
    });
  }

  /**
   * 查找用户，并验证给定密码是否正确
   * @param phone
   * @param password 密码明文
   * @returns
   */
  async findAndValidate(phone: string, password: string): Promise<User> {
    const signPass = sha256(password).toString();
    const user = await this.userModel.findOne({
      phone: phone,
      password: signPass,
    });
    return user;
  }
}
