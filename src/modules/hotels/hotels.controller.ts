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
  UseFilters,
  Put
} from '@nestjs/common'
import { HotelRoomsService, HotelsService } from './hotels.service'

import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { SearchRoomsParams } from './interfaces/hotel.interface'
import { Types } from 'mongoose'
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Hotel } from './schemas/hotel.schema'

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('admin')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelRoomsService: HotelRoomsService
  ) {}

  @Roles('admin')
  @UseFilters(ValidationDtoFilter)
  @Post('hotels')
  async createHotel(@Body() data: Hotel) {
    return await this.hotelsService.create(data)
  }

  @Roles('admin')
  @Get('hotels')
  public search(@Query() params: Pick<Hotel, 'title'>): Promise<Hotel[]> {
    //TODO: limit&offset
    return this.hotelsService.search(params)
  }

  /* @Roles('admin')
  @Put('hotels/:id') */
  //TODO: в сервисе Hotel нет update метода!

  @Roles('admin')
  @UseFilters(ValidationDtoFilter)
  @Post('hotel-rooms')
  async createHotelRoom(@Body() data: Hotel) {
    //TODO: multipart/form-data загрузка файлов
    return await this.hotelRoomsService.create(data)
  }

  @Roles('admin')
  @Put('hotel-rooms/:id')
  updateHotelRoom(
    @Param('id') id: Types.ObjectId,
    @Body() data: HotelRoomDocument
  ) {
    return this.hotelRoomsService.update(id, data)
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
