import { Module } from '@nestjs/common'
import { HotelRoomsService, HotelsService } from './hotels.service'
import { HotelRoomsController, HotelsController } from './hotels.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Hotel, HotelSchema } from './schemas/hotel.schema'
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema }
    ])
  ],
  controllers: [HotelsController, HotelRoomsController],
  providers: [HotelsService, HotelRoomsService],
  exports: [HotelsService, HotelRoomsService]
})
export class HotelsModule {}
