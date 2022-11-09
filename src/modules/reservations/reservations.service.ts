import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { IReservation, ReservationDto, ReservationSearchOptions } from './interfaces/reservation.interface'
import { Reservation, ReservationDocument } from './schemas/reservation.schema'
import { HttpException } from '@nestjs/common'
import { UserDocument } from '../users/schemas/user.schema'

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<ReservationDocument>
  ) {}

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    const reservations = await this.ReservationModel.find({ room: data.room })
    if (reservations) {
      const ds = new Date(data.dateStart)
      const de = new Date(data.dateEnd)
      if (
        reservations.find(
          (res: ReservationDocument) =>
            (ds <= new Date(res.dateStart) && de >= new Date(res.dateEnd)) ||
            (ds <= new Date(res.dateEnd) && de >= new Date(res.dateEnd)) ||
            (ds <= new Date(res.dateStart) && de >= new Date(res.dateStart))
        )
      )
        return null
    }
    return new this.ReservationModel(data).save()
  }

  async getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
    return await this.ReservationModel.find(filter, { user: 0, _id: 0, __v: 0 })
      .populate({ path: 'hotel', select: { title: 1, description: 1, _id: 0 } })
      .populate({ path: 'room', select: { images: 1, description: 1, _id: 0 } })
      .exec()
  }

  async removeReservation(id: Types.ObjectId, user?: UserDocument): Promise<void> {
    const reservation = await this.ReservationModel.findById(id)
    if (!reservation) throw new HttpException('Резервация не найдена', 400)
    if (user && reservation.user != user._id) throw new HttpException('Доступ запрещен', 403)
    this.ReservationModel.findByIdAndRemove(id).exec()
    return
  }
}
