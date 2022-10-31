import { Request, Controller, Post, UseGuards } from '@nestjs/common'
import { isPublicRoute } from 'src/common/decorators/my-custom.decorator'
import { LocalAuthGuard } from 'src/common/guards/loc-auth.guard'

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(LocalAuthGuard)
  @isPublicRoute()
  @Post('login')
  async login(@Request() req) {
    const { email, name, contactPhone } = req.session.passport.user
    return { email, name, contactPhone }
  }

  @Post('logout')
  logout(@Request() req) {
    req.session.destroy()
  }
}
