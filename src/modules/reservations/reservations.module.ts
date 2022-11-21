import { Module } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { ReservationsController, ReservationsManagerController } from './reservations.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Reservation, ReservationSchema } from './schemas/reservation.schema'
import { HotelsModule } from '../hotels/hotels.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]), HotelsModule],
  controllers: [ReservationsController, ReservationsManagerController],
  providers: [ReservationsService],
  exports: [ReservationsService]
})
export class ReservationsModule {}
