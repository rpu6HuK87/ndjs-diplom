import { Body, Controller, Post, UseFilters, BadRequestException, Query, Get } from '@nestjs/common'
import { isPublicRoute } from 'src/common/decorators/my-custom.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { SearchUserParams } from './interfaces/user.interface'
import { User } from './schemas/user.schema'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}
  @isPublicRoute()
  @UseFilters(ValidationDtoFilter)
  @Post('client/register')
  async clientRegister(@Body() body: User) {
    const user = await this.userService.create({ ...body, role: 'client' })
    const { password, ...result } = body
    return { ...result, id: user.id }
  }

  @Roles('admin')
  @UseFilters(ValidationDtoFilter)
  @Post('admin/users')
  async createUser(@Body() body: User) {
    const user = await this.userService.create(body)
    const { password, ...result } = body
    return { ...result, id: user.id }
  }

  @Roles('admin')
  @Get('admin/users')
  async findUsersByAdmin(@Query() params: SearchUserParams) {
    return await this.userService.findAll(params)
  }

  @Roles('manager')
  @Get('manager/users')
  async findUsersByManager(@Query() params: SearchUserParams) {
    return await this.userService.findAll(params)
  }
}
