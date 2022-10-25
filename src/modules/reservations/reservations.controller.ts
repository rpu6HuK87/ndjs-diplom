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
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import {
  ReservationDto,
  ReservationSearchOptions
} from './interfaces/reservation.interface'
import { ReservationsService } from './reservations.service'
import { Reservation } from './schemas/reservation.schema'

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('client')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles('client')
  @UseFilters(ValidationDtoFilter)
  @Post('reservations')
  async addReservation(@Body() data: ReservationDto) {
    //TODO: формат ответа, код ответа 400 если не найден номер
    return await this.reservationsService.addReservation(data)
  }

  @Roles('client')
  @Get('reservations')
  public getReservations(
    @Query() filter: ReservationSearchOptions
  ): Promise<Reservation[]> {
    //TODO: формат ответа
    return this.reservationsService.getReservations(filter)
  }

  @Roles('client')
  @Delete('reservations/:id')
  removeReservation(@Param('id') id: Types.ObjectId) {
    //TODO: формат ответа, коды ответа
    return this.reservationsService.removeReservation(id)
  }
}
