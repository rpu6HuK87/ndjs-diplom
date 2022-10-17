import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'
import { Hotel } from './hotel.schema'

export type HotelRoomDocument = HotelRoom & Document

@Schema()
export class HotelRoom {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotel: Hotel

  @Prop()
  description: string

  @Prop({ required: true, default: [] })
  images: string[]

  @Prop({ required: true, type: String })
  createdAt: Date

  @Prop({ required: true, type: String })
  updatedAt: Date

  @Prop({ required: true, default: true })
  isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)
