import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'
import { HotelRoom } from 'src/modules/hotels/schemas/hotel-room.schema'
import { Hotel } from 'src/modules/hotels/schemas/hotel.schema'
import { User } from 'src/modules/users/schemas/user.schema'

export type ReservationDocument = Reservation & Document

@Schema()
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User

  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotel: Hotel

  @Prop({ required: true, type: Types.ObjectId, ref: 'HotelRoom' })
  room: HotelRoom

  @Prop({ required: true, type: Date })
  dateStart: string

  @Prop({ required: true, type: Date })
  dateEnd: string
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)
