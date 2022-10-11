import { Body, Request, Controller, Post, UseGuards, UseFilters, HttpStatus, BadRequestException } from '@nestjs/common';
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { LocalAuthGuard } from 'src/common/guards/loc-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
//import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(
    //private authService: AuthService,
    private userService: UsersService
  ) {}
	
	@UseFilters(ValidationDtoFilter)
  @Post('client/register')
  async create(@Body() body: CreateUserDto) {
		const { email } = body
		const isset = await this.userService.findByEmail(email)
		if(isset) throw new BadRequestException({error: 'Пользователь с таким email уже существует'})
		
		const user = await this.userService.create({...body, role: 'client'})
		const {password, ...result} = body
		return 	{...result, id: user.id}
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
		const {email, name, contactPhone} = req.session.passport.user
		return {email, name, contactPhone}
  }

	@UseGuards(AuthenticatedGuard)
  @Post('auth/logout')
  logout(@Request() req) {
		req.session.destroy()
	}
}
