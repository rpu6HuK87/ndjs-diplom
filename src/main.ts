import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import * as passport from 'passport'
import { AuthenticatedGuard } from './common/guards/authenticated.guard'
import { RolesGuard } from './common/guards/roles.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.use(
    session({
      secret: 'hotelSecret',
      resave: false,
      saveUninitialized: false
    })
  )

  const reflector = app.get(Reflector)
  app.useGlobalGuards(new AuthenticatedGuard(reflector))
  app.useGlobalGuards(new RolesGuard(reflector))

  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(3000)
}
bootstrap()
