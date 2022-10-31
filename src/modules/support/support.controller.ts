import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Query
} from '@nestjs/common'
import { Types } from 'mongoose'
import { isEnabledFlag, User } from 'src/common/decorators/my-custom.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidationDtoFilter } from 'src/common/exceptions/filters/dto-validation.filter'
import {
  CreateSupportRequestDto,
  GetChatListParams,
  SendMessageDto
} from './interfaces/support.interface'
import { SupportRequest } from './schemas/support-requests.schema'
import {
  SupportRequestClientService,
  SupportRequestService
} from './support.service'

@Controller('client/support-requests')
export class SupportController {
  constructor(
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestService: SupportRequestService
  ) {}

  @Roles('client')
  @UseFilters(ValidationDtoFilter)
  @Post()
  async createSupportRequest(
    @Body() data: CreateSupportRequestDto,
    @User() user
  ) {
    const request = await this.supportRequestClientService.createSupportRequest(
      { ...data, user: user._id }
    )

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
    console.log(user)
    const requests = await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id
    })
    console.log(requests)
    /* return requests.map((req) => {
      const { messages, ...rest } = req
      console.log(messages)
      return {
        ...rest,
        hasNewMessages: messages.find((msg) => !msg.readAt) ? true : false
      }
    }) */
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

    return [message]
  }
}
