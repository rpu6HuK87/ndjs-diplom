import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { SupportRequest, SupportRequestDocument } from './schemas/support-requests.schema'
import {
  CreateSupportRequestDto,
  GetChatListParams,
  ISupportRequestClientService,
  ISupportRequestService,
  MarkMessagesAsReadDto,
  SendMessageDto
} from './interfaces/support.interface'
import { Message, MessageDocument } from './schemas/message.schema'

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
    return await this.SupportRequestModel.find(params)
  }

  async getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]> {
    return await this.SupportRequestModel.find(supportRequest)
  }
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name)
    private MessageModel: Model<Message>,
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequest>
  ) {}

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const supportRequest = await this.SupportRequestModel.findById(data.supportRequest)
    if (supportRequest) {
      const message = await new this.MessageModel(data).save()
      if (message) {
        await this.SupportRequestModel.findByIdAndUpdate(
          data.supportRequest,
          { $push: { messages: message } }
          /* {
          messages: supportRequest.messages.push(message)
        } */
        )
      }
      return message
    }
  }

  async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    const { limit, offset = 0, ...rest } = params
    const request = this.SupportRequestModel.find(rest).skip(offset)
    if (!rest.user) request.populate('user')
    if (limit) request.limit(limit)

    return await request.exec()
  }

  async getMessages(supportRequest: Types.ObjectId): Promise<Message[]> {
    const request = await this.SupportRequestModel.findById(supportRequest) //.populate('messages.author')
    //console.log(request)
    return request.messages
  }

  /* async subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
		
	} */
}
