import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Query } from '@nestjs/common'
import { Types } from 'mongoose'
import { identity } from 'rxjs'
import { User } from 'src/common/decorators/my-custom.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import { CreateSupportRequestDto, GetChatListParams, SendMessageDto } from './interfaces/support.interface'
import { SupportRequestClientService, SupportRequestService } from './support.service'

@Controller('client/support-requests')
export class SupportClientController {
  constructor(
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestService: SupportRequestService
  ) {}

  @Roles('client')
  @UseFilters(ValidationDtoFilter)
  @Post()
  async createSupportRequest(@Body() data: CreateSupportRequestDto, @User() user) {
    const request = await this.supportRequestClientService.createSupportRequest({ ...data, user: user._id })

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
    params.isActive = Boolean(params?.isActive)
    const requests = await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id
    })
    //return requests
    return requests.map((req) => {
      const { messages, user, ...rest } = req
      return {
        //...rest,
        hasNewMessages: messages?.find((msg) => !msg.readAt && msg.author != user._id) ? true : false
      }
    })
  }

  @Roles('client')
  @Roles('manager')
  @UseFilters(ValidationDtoFilter)
  @Post(':id/messages')
  async sendMessage(
    @Param('id') requestId: Types.ObjectId,
    @Body()
    data: SendMessageDto,
    @User() user
  ) {
    const message = await this.supportRequestService.sendMessage({
      author: user._id,
      supportRequest: requestId,
      text: data.text
    })

    return message
  }
}
@Controller('common/support-requests')
export class SupportCommonController {
  constructor(private readonly supportRequestService: SupportRequestService) {}
  @Roles('client', 'manager')
  @Get(':id/messages')
  async getSupportRequestMessages(@Param('id') requestId: Types.ObjectId, @User() user) {
    const messages = await this.supportRequestService.getMessages(requestId)
    return messages
  }
}
@Controller('manager/support-requests')
export class SupportManagerController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @Roles('manager')
  @Get()
  async getSupportRequests(@Query() params: GetChatListParams) {
    params.isActive = Boolean(params?.isActive)
    const requests = await this.supportRequestService.findSupportRequests(params)
    return requests.map((req) => {
      const { messages, user, ...rest } = req
      const { _id, role, __v, password, ...client } = user
      return {
        ...rest,
        hasNewMessages: messages?.find((msg) => !msg.readAt) ? true : false,
        client: client
      }
    })
  }
}
