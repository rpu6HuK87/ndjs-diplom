import { Types } from 'mongoose'
import { HotelRoom } from '../schemas/hotel-room.schema'
import { Hotel } from '../schemas/hotel.schema'

export interface SearchHotelParams {
  limit: number
  offset: number
  title: string
}

export interface UpdateHotelParams {
  title: string
  description: string
}

export interface IHotelService {
  create(data: any): Promise<Hotel>
  findById(id: Types.ObjectId): Promise<Hotel>
  search(params: SearchHotelParams): Promise<Hotel[]>
  update(id: Types.ObjectId, data: UpdateHotelParams): Promise<Hotel>
}

export interface SearchRoomsParams {
  limit: number
  offset: number
  title: string
  isEnabled?: true
}

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>
  findById(id: Types.ObjectId, isEnabled?: true): Promise<HotelRoom>
  search(params: SearchRoomsParams): Promise<HotelRoom[]>
  update(id: Types.ObjectId, data: Partial<HotelRoom>): Promise<HotelRoom>
}
