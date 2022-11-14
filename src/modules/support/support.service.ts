import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-requests.schema'
import {
  CreateSupportRequestDto,
  GetChatListParams,
  ISupportRequestClientService,
  ISupportRequestEmployeeService,
  ISupportRequestService,
  MarkMessagesAsReadDto,
  SendMessageDto
} from './interfaces/support.interface'
import { Message, MessageDocument } from './schemas/message.schema'
import { UserDocument } from '../users/schemas/user.schema'

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name)
    private MessageModel: Model<Message>,
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequest>
  ) {}

  async sendMessage(data: SendMessageDto, user?: UserDocument): Promise<Message> {
    const supportRequest = await this.SupportRequestModel.findById(data.supportRequest)
    if (supportRequest) {
      //console.log(supportRequest.user, user._id)
      if (user && supportRequest.user !== user._id) throw new HttpException('Доступ запрещен', 403)
      const message = new this.MessageModel(data)
      await this.SupportRequestModel.findByIdAndUpdate(data.supportRequest, {
        $push: { messages: message }
      })
      return message
    }
  }

  async findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]> {
    const { limit, offset = 0, ...rest } = params
    const request = this.SupportRequestModel.find(rest).skip(offset)
    if (!rest.user) request.populate('user')
    if (limit) request.limit(limit)

    return await request.exec()
  }

  async getMessages(supportRequest: Types.ObjectId, user?: UserDocument): Promise<Message[]> {
    const request = await this.SupportRequestModel.findById(supportRequest).populate({
      path: 'messages.author',
      model: 'User'
    })
    if (user && request.user !== user._id) throw new HttpException('Доступ запрещен', 403)
    //.select({ __v: 0 })
    //.populate('messages.author')
    return request.messages
  }

  /* async subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void
  ): () => void {} */
}

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequest>
  ) {}

  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument> {
    const supportRequest = new this.SupportRequestModel(data)
    return await supportRequest.save()
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const request = await this.SupportRequestModel.findById(params.supportRequest)
      .populate({
        path: 'messages.author',
        model: 'User'
      })
      .populate({
        path: 'user',
        model: 'User'
      })

    if (request.user._id.toString() !== params.user) throw new HttpException('Доступ запрещен', 403)

    if (request.messages) {
      const now = new Date()
      const createdBefore = params.createdBefore ? new Date(params.createdBefore) : now

      let needupdate = false
      request.messages.map((msg) => {
        const sentAt = new Date(msg.sentAt)
        if (sentAt <= createdBefore && msg.author._id.toString() !== params.user && !msg.readAt) {
          msg.readAt = now.toISOString()
          if (!needupdate) needupdate = true
        }
      })
      if (needupdate)
        await this.SupportRequestModel.findByIdAndUpdate(
          params.supportRequest,
          { messages: request.messages },
          { new: true }
        )
    }
    return request
  }

  async getUnreadCount(supportRequest: Types.ObjectId, user?: UserDocument): Promise<Message[]> {
    const request = await this.SupportRequestModel.findById(supportRequest)
    return request.messages.filter((msg) => !msg.readAt && msg.author != user._id)
  }
}

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequest>
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const request = await this.SupportRequestModel.findById(params.supportRequest).populate({
      path: 'messages.author',
      model: 'User'
    })
    if (request.messages) {
      const now = new Date()
      const createdBefore = params.createdBefore ? new Date(params.createdBefore) : now

      let needupdate = false
      request.messages.map((msg) => {
        const sentAt = new Date(msg.sentAt)
        if (sentAt <= createdBefore && msg.author._id.toString() === request.user && !msg.readAt) {
          msg.readAt = now.toISOString()
          if (!needupdate) needupdate = true
        }
      })
      if (needupdate)
        await this.SupportRequestModel.findByIdAndUpdate(
          params.supportRequest,
          { messages: request.messages },
          { new: true }
        )
    }
    return request
  }

  async getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]> {
    const request = await this.SupportRequestModel.findById(supportRequest)
    return request.messages.filter((msg) => !msg.readAt && msg.author != request.user)
  }

  async closeRequest(supportRequest: Types.ObjectId): Promise<void> {
    return await this.SupportRequestModel.findByIdAndUpdate(
      supportRequest,
      { isActive: false },
      { new: true }
    )
  }
}
