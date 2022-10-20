import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions
} from './interfaces/reservation.interface'
import { Reservation, ReservationDocument } from './schemas/reservation.schema'

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<ReservationDocument>
  ) {}

  addReservation(data: ReservationDto): Promise<ReservationDocument> {
    //TODO: Метод IReservation.addReservation должен проверять, доступен ли номер на заданную дату.
    return new this.ReservationModel(data).save()
  }

  removeReservation(id: Types.ObjectId): Promise<void> {
    this.ReservationModel.findByIdAndRemove(id).exec()
    return
  }

  getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
    return this.ReservationModel.find(filter).exec()
  }
}
