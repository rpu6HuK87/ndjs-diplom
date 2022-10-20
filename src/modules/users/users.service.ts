import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { IUserService, SearchUserParams } from './interfaces/user.interface'
import { User, UserDocument } from './schemas/user.schema'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(data: User): Promise<UserDocument> {
    //console.log('create', data)
    data.password = await bcrypt.hash(data.password, 10)
    const user = new this.UserModel(data)
    return user.save()
  }

  findById(id: Types.ObjectId): Promise<UserDocument> {
    return this.UserModel.findById(id).exec()
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.UserModel.findOne({ email: email }).exec()
  }

  findAll(params: SearchUserParams): Promise<UserDocument[]> {
    //TODO: поля email, name и contactPhone должны проверяться на частичное совпадение.
    return this.UserModel.find(params).exec()
  }
}
