import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { string } from 'joi';

@Injectable()
export class UsersService implements IUserService {
	constructor(
		@InjectModel(User.name) private UserModel: Model<UserDocument>,
	) {}

  public async create(data: CreateUserDto): Promise<UserDocument> {
    data.password = await bcrypt.hash(data.password, 10)
		const user = new this.UserModel(data)
		return user.save()
  }

  /* findAll() {
    return `This action returns all users`;
  } */

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
