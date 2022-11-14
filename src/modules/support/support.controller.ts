import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseFilters,
  Query,
  HttpException
} from '@nestjs/common'
import { Types } from 'mongoose'
import { User } from 'src/common/decorators/my-custom.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import {
  CreateSupportRequestDto,
  GetChatListParams,
  MarkMessagesAsReadDto,
  SendMessageDto
} from './interfaces/support.interface'
import { SupportGateway } from './support.gateway'
import {
  SupportRequestClientService,
  SupportRequestEmployeeService,
  SupportRequestService
} from './support.service'

@Controller('client/support-requests')
export class SupportClientController {
  constructor(
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestService: SupportRequestService,
    private readonly supportGateway: SupportGateway
  ) {}

  @Roles('client')
  @UseFilters(ValidationDtoFilter)
  @Post()
  async createSupportRequest(@Body() data: CreateSupportRequestDto, @User() user) {
    const request = await this.supportRequestClientService.createSupportRequest({
      ...data,
      user: user._id
    })

    const message = await this.supportRequestService.sendMessage({
      author: user._id,
      supportRequest: request._id,
      text: data.text
    })

    return [
      {
        id: request._id,
        createdAt: request.createdAt,
        isActive: true,
        hasNewMessages: false
      }
    ]
  }

  @Roles('client')
  @Get()
  async getSupportRequests(@Query() params: GetChatListParams, @User() user) {
    const requests = await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id
    })
    return requests.map((req) => {
      const { messages, user, isActive, createdAt, _id } = req
      return {
        id: _id,
        createdAt,
        isActive,
        hasNewMessages: messages?.find((msg) => !msg.readAt && msg.author != user._id)
          ? true
          : false
      }
    })
  }

  @Roles('client', 'manager')
  @UseFilters(ValidationDtoFilter)
  @Post(':id/messages')
  async sendMessage(
    @Param('id') requestId: Types.ObjectId,
    @Body()
    data: SendMessageDto,
    @User() user
  ) {
    const message = await this.supportRequestService.sendMessage(
      {
        author: user._id,
        supportRequest: requestId,
        text: data.text
      },
      user.role === 'client' ? user : false
    )
    this.supportGateway.ws.to(requestId.toString()).emit('new-message', message)

    return message
  }
}

@Controller('common/support-requests')
export class SupportCommonController {
  constructor(
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService
  ) {}
  @Roles('client', 'manager')
  @Get(':id/messages')
  async getSupportRequestMessages(@Param('id') requestId: Types.ObjectId, @User() user) {
    const messages = await this.supportRequestService.getMessages(
      requestId,
      user.role === 'client' ? user : false
    )
    return messages.map((msg) => {
      const { author, ...rest } = msg
      const { _id, name } = author
      return {
        ...rest,
        author: { _id, name }
      }
    })
  }

  @Roles('client', 'manager')
  @Post(':id/messages/read')
  async markAsRead(
    @Body()
    params: Partial<MarkMessagesAsReadDto>,
    @Param('id') requestId: Types.ObjectId,
    @User() user
  ) {
    const markData = {
      user: user._id,
      supportRequest: requestId,
      createdBefore: params.createdBefore
    }
    if (user.role === 'client') await this.supportRequestClientService.markMessagesAsRead(markData)
    if (user.role === 'manager')
      await this.supportRequestEmployeeService.markMessagesAsRead(markData)

    return { success: true }
  }
}

@Controller('manager/support-requests')
export class SupportManagerController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @Roles('manager')
  @Get()
  async getSupportRequests(@Query() params: GetChatListParams) {
    const requests = await this.supportRequestService.findSupportRequests(params)
    return requests.map((req) => {
      const { messages, user, isActive, createdAt, _id } = req
      const { id = _id, name, email, contactPhone } = user
      return {
        id: _id,
        isActive,
        createdAt,
        hasNewMessages: messages?.find((msg) => !msg.readAt) ? true : false,
        client: { id, name, email, contactPhone }
      }
    })
  }
}
