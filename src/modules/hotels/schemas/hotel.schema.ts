import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document } from 'mongoose'

export type HotelDocument = Hotel & Document

@Schema()
export class Hotel {
  @Prop({ required: true })
  title: string

  @Prop()
  description: string

  @Prop({ required: true, type: String })
  createdAt: Date

  @Prop({ required: true, type: String })
  updatedAt: Date
}

export const HotelSchema = SchemaFactory.createForClass(Hotel)
