import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import {
  HotelRoomService,
  IHotelService,
  SearchHotelParams,
  SearchRoomsParams,
  UpdateHotelParams
} from './interfaces/hotel.interface'
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema'
import { Hotel, HotelDocument } from './schemas/hotel.schema'

@Injectable()
export class HotelsService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>) {}

  async create(data: Hotel): Promise<HotelDocument> {
    const time = Date.now()
    const hotel = new this.HotelModel({
      ...data,
      createdAt: time,
      updatedAt: time
    })
    return await hotel.save()
  }

  async findById(id: Types.ObjectId): Promise<HotelDocument> {
    return await this.HotelModel.findById(id).exec()
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    return await this.HotelModel.find(params, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    }).exec()
  }

  async update(id: Types.ObjectId, data: UpdateHotelParams): Promise<HotelDocument> {
    return this.HotelModel.findByIdAndUpdate(id, data, { new: true }).exec()
  }
}

@Injectable()
export class HotelRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoomDocument>
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const room = new this.HotelRoomModel(data)
    return await room.save().then((room) =>
      room.populate({
        path: 'hotel',
        select: { title: 1, description: 1 }
      })
    )
  }

  async findById(id: Types.ObjectId, isEnabled?: true): Promise<HotelRoom> {
    const room = await this.HotelRoomModel.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })
      .limit(1)
      .populate({
        path: 'hotel',
        select: { title: 1, description: 1 }
      })
      .exec()

    return (isEnabled && room?.isEnabled) || isEnabled === undefined ? room : null
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const { limit, offset = 0, ...rest } = params
    const rooms = this.HotelRoomModel.find(rest, {
      isEnabled: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })
      .skip(offset)
      .populate({
        path: 'hotel',
        select: { title: 1 }
      })
    if (limit) rooms.limit(limit)
    return rooms.exec()
  }

  async update(id: Types.ObjectId, data: Partial<HotelRoom>): Promise<HotelRoom> {
    return this.HotelRoomModel.findByIdAndUpdate(id, data, { new: true }).exec()
  }
}
