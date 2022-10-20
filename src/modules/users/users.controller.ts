import {
  Body,
  Controller,
  Post,
  UseFilters,
  BadRequestException
} from '@nestjs/common'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { User } from './schemas/user.schema'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseFilters(ValidationDtoFilter)
  @Post('client/register')
  async create(@Body() body: User) {
    const { email } = body
    const isset = await this.userService.findByEmail(email)
    if (isset) {
      throw new BadRequestException({
        error: 'Пользователь с таким email уже существует'
      })
    }

    const user = await this.userService.create({ ...body, role: 'client' })
    const { password, ...result } = body
    return { ...result, id: user.id }
  }
}
