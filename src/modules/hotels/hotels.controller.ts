import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common'
import { HotelRoomsService, HotelsService } from './hotels.service'
import { CreateHotelDto } from './dto/create-hotel.dto'
import { UpdateHotelDto } from './dto/update-hotel.dto'

import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { SearchRoomsParams } from './interfaces/hotel.interface'
import { Types } from 'mongoose'
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard'
import { Roles } from 'src/common/decorators/roles.decorator'

@UseGuards(AuthenticatedGuard)
@Roles('admin')
@Controller('admin')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}
}

@Controller('common/hotel-rooms')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Get()
  public search(@Query() params: SearchRoomsParams): Promise<HotelRoom[]> {
    return this.hotelRoomsService.search(params)
  }
  @Get(':id')
  public findById(@Param('id') id: Types.ObjectId): Promise<HotelRoom> {
    return this.hotelRoomsService.findById(id)
  }
}
