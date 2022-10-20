import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'
import { HotelRoom } from 'src/modules/hotels/schemas/hotel-room.schema'
import { Hotel } from 'src/modules/hotels/schemas/hotel.schema'
import { User } from 'src/modules/users/schemas/user.schema'

export type ReservationDocument = Reservation & Document

@Schema()
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: User

  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotelId: Hotel

  @Prop({ required: true, type: Types.ObjectId, ref: 'HotelRoom' })
  roomId: HotelRoom

  @Prop({ required: true, type: String })
  dateStart: Date

  @Prop({ required: true, type: String })
  dateEnd: Date
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)
