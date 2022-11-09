import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseFilters,
  Put,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder
} from '@nestjs/common'
import { Types } from 'mongoose'

import { HotelRoomsService, HotelsService } from './hotels.service'
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { SearchHotelParams, SearchRoomsParams, UpdateHotelParams } from './interfaces/hotel.interface'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { Hotel } from './schemas/hotel.schema'
import { isEnabledFlag, isPublicRoute } from 'src/common/decorators/my-custom.decorator'
import { FilesInterceptor } from '@nestjs/platform-express'
import { uploadOptions } from 'src/common/exceptions/filters/upload.filter'

@Controller('admin')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService, private readonly hotelRoomsService: HotelRoomsService) {}

  @Roles('admin')
  @UseFilters(ValidationDtoFilter)
  @Post('hotels')
  async createHotel(@Body() data: Hotel) {
    const hotel = await this.hotelsService.create(data)
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description
    }
  }

  @Roles('admin')
  @Get('hotels')
  search(@Query() params: SearchHotelParams): Promise<Hotel[]> {
    return this.hotelsService.search(params)
  }

  @Roles('admin')
  @Put('hotels/:id')
  async updateHotel(@Param('id') id: Types.ObjectId, @Body() data: UpdateHotelParams) {
    const hotel = await this.hotelsService.update(id, data)
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description
    }
  }

  @Roles('admin')
  @UseFilters(ValidationDtoFilter)
  @UseInterceptors(FilesInterceptor('files', 5, uploadOptions))
  @Post('hotel-rooms')
  async createHotelRoom(@Body() data: HotelRoom, @UploadedFiles() files: Array<Express.Multer.File>) {
    data.images = files.map((file) => file.originalname)
    console.log(files)
    return await this.hotelRoomsService.create(data)
  }

  @Roles('admin')
  @UseInterceptors(FilesInterceptor('files', 5, uploadOptions))
  @Put('hotel-rooms/:id')
  updateHotelRoom(
    @Param('id') id: Types.ObjectId,
    @Body() data: HotelRoomDocument,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    if (files) data.images = files.map((file) => file.originalname)
    return this.hotelRoomsService.update(id, data)
  }
}

@Controller('common/hotel-rooms')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @isPublicRoute()
  @Get()
  public search(@Query() params: SearchRoomsParams, @isEnabledFlag() flag: true): Promise<HotelRoom[]> {
    if (flag) params.isEnabled = flag
    return this.hotelRoomsService.search(params)
  }

  @isPublicRoute()
  @Get(':id')
  public findById(@Param('id') id: Types.ObjectId, @isEnabledFlag() flag: true): Promise<HotelRoom> {
    return this.hotelRoomsService.findById(id, flag)
  }
}
