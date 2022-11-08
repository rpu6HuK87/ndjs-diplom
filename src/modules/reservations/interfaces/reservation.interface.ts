import { Types } from 'mongoose'
import { Reservation } from '../schemas/reservation.schema'

export interface ReservationDto {
  userId: Types.ObjectId
  hotelId: Types.ObjectId
  roomId: Types.ObjectId
  dateStart: Date
  dateEnd: Date
}
export interface ReservationSearchOptions {
  userId: Types.ObjectId
  dateStart: Date
  dateEnd: Date
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>
  removeReservation(id: Types.ObjectId): Promise<void>
  getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>>
}
