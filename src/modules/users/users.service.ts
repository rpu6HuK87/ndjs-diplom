import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { IUserService, SearchUserParams } from './interfaces/user.interface'
import { User, UserDocument } from './schemas/user.schema'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(data: User): Promise<UserDocument> {
    const { email } = data
    const isset = await this.UserModel.findOne({ email: email }).exec()
    if (isset) throw new BadRequestException({ error: 'Пользователь с таким email уже существует' })

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

  async findAll(params: SearchUserParams): Promise<UserDocument[]> {
    const { limit, offset = 0, ...rest } = params
    const users = this.UserModel.find(rest, { password: 0, __v: 0 }).skip(offset)
    if (limit) users.limit(limit)

    return await users.exec()
  }
}
