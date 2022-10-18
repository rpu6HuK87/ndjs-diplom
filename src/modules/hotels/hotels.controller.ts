import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseFilters
} from '@nestjs/common'
import { HotelRoomsService, HotelsService } from './hotels.service'
import { CreateHotelDto } from './dto/create-hotel.dto'
import { UpdateHotelDto } from './dto/update-hotel.dto'

import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { SearchRoomsParams } from './interfaces/hotel.interface'
import { Types } from 'mongoose'
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Hotel } from './schemas/hotel.schema'

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('admin/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Roles('admin')
  @UseFilters(ValidationDtoFilter)
  @Post()
  async createHotel(@Body() data: CreateHotelDto) {
    return await this.hotelsService.create(data)
  }

  @Roles('admin')
  @Get()
  public search(@Query() params): Promise<Hotel[]> {
    //TODO: limit&offset
    return this.hotelsService.search(params)
  }
}

@Controller('common/hotel-rooms')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Get()
  public search(@Query() params: SearchRoomsParams): Promise<HotelRoom[]> {
    //TODO: limit&offset&hotelid
    return this.hotelRoomsService.search(params)
  }
  @Get(':id')
  public findById(@Param('id') id: Types.ObjectId): Promise<HotelRoom> {
    return this.hotelRoomsService.findById(id)
  }
}
