import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MulterModule } from '@nestjs/platform-express'
import { join } from 'path'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { HotelsModule } from './modules/hotels/hotels.module'
import { ReservationsModule } from './modules/reservations/reservations.module'
import { SupportModule } from './modules/support/support.module'

import { diskStorage } from 'multer'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL, {
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './public/images/rooms'
      })
    }),
    //для проверки ws
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    }),
    UsersModule,
    AuthModule,
    HotelsModule,
    ReservationsModule,
    SupportModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
