import * as sha256 from 'crypto-js/sha256';
import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async findByPhone(phone: string) {
    return this.userModel.findOne({
      phone,
    });
  }

  async verifyUser(phone: string, password: string) {
    const signPass = sha256(password).toString();
    const user = await this.userModel.findOne({
      phone: phone,
      password: signPass,
    });
    return !!user;
  }
}
