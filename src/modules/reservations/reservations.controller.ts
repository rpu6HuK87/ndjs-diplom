import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  Query
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { ReservationSearchOptions } from './interfaces/reservation.interface'
import { ReservationsService } from './reservations.service'
import { Reservation } from './schemas/reservation.schema'
import { isEnabledFlag, User } from 'src/common/decorators/my-custom.decorator'
import { HotelRoomsService } from '../hotels/hotels.service'
import { HttpException } from '@nestjs/common'

@Controller('client')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly hotelRoomService: HotelRoomsService
  ) {}

  @Roles('client')
  @UseFilters(ValidationDtoFilter)
  @Post('reservations')
  async addReservation(
    @Body() data,
    @User() user,
    @isEnabledFlag() flag: true
  ) {
    const room = await this.hotelRoomService.findById(data.room, flag)
    if (!room) throw new HttpException('Номер не найден', 400)

    const reservationData = { ...data, user: user._id, hotel: room.hotel._id }
    const reservation = await this.reservationsService.addReservation(
      reservationData
    )
    if (!reservation) throw new HttpException('Номер занят', 400)

    return {
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      hotelRoom: { description: room.description, images: room.images },
      hotel: room.hotel
    }
  }

  @Roles('client')
  @Get('reservations')
  getReservations(
    @Query() filter: ReservationSearchOptions
  ): Promise<Reservation[]> {
    return this.reservationsService.getReservations(filter)
  }

  @Roles('client')
  @Delete('reservations/:id')
  removeReservation(@Param('id') id: Types.ObjectId) {
    //TODO: формат ответа, коды ответа
    return this.reservationsService.removeReservation(id)
  }
}

@Controller('manager')
export class ReservationsManagerController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles('manager')
  @Get('reservations/:userId')
  getReservations(
    @Param('userId') id: Types.ObjectId,
    @Query() filter: ReservationSearchOptions
  ): Promise<Reservation[]> {
    filter.user = id

    return this.reservationsService.getReservations(filter)
  }

  @Roles('manager')
  @Get()
  @Delete('reservations/:userId/:reservationId')
  removeReservation(@Param('reservationId') id: Types.ObjectId) {
    //TODO: формат ответа, коды ответа
    return this.reservationsService.removeReservation(id)
  }
}
