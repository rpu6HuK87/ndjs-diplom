import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  HotelRoomService,
  IHotelService,
  SearchRoomsParams
} from './interfaces/hotel.interface'
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { Hotel, HotelDocument } from './schemas/hotel.schema'

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>
  ) {}

  async create(data: Hotel): Promise<HotelDocument> {
    const time = Date.now()
    const hotel = new this.HotelModel({
      ...data,
      createdAt: time,
      updatedAt: time
    })
    return hotel.save()
  }

  findById(id: Types.ObjectId): Promise<HotelDocument> {
    return this.HotelModel.findById(id).exec()
  }

  search(params: Pick<Hotel, 'title'>): Promise<Hotel[]> {
    return this.HotelModel.find(params).exec()
  }
}

@Injectable()
export class HotelRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoomDocument>
  ) {}

  create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const room = new this.HotelRoomModel(data)
    return room.save()
  }

  findById(id: Types.ObjectId, isEnabled?: true): Promise<HotelRoom> {
    //TODO: isEnabled?
    return this.HotelRoomModel.findById(id).exec()
  }

  search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    return this.HotelRoomModel.find(params).exec()
  }

  update(id: Types.ObjectId, data: Partial<HotelRoom>): Promise<HotelRoom> {
    return this.HotelRoomModel.findByIdAndUpdate(id, data).exec()
  }
}
