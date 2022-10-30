import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'
import { Hotel, HotelDocument } from './hotel.schema'

export type HotelRoomDocument = HotelRoom & Document

@Schema({
  timestamps: true
})
export class HotelRoom {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotel: HotelDocument

  @Prop()
  description: string

  @Prop({ required: true, default: [] })
  images: string[]

  @Prop({ required: true, default: true })
  isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)
