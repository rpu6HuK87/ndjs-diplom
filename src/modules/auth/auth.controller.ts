import { Request, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { LocalAuthGuard } from 'src/common/guards/loc-auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { email, name, contactPhone } = req.session.passport.user;
    return { email, name, contactPhone };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Request() req) {
    req.session.destroy();
  }
}
