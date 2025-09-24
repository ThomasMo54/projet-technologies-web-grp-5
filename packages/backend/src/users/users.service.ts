import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(email: string, password: string, lastname: string, firstname: string, type: string): Promise<User> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword, lastname, firstname, type });
    return newUser.save();
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findOne({ uuid: id }).exec();
  }

  async findUserByIdWithoutPassword(id: string): Promise<User | null> {
    return this.userModel.findOne({ uuid: id }).select('-password').exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ uuid: id }, updateData, { new: true }).select('-password').exec();
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ uuid: id }).select('-password').exec();
  }
}