import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  SupportRequestClientService,
  SupportRequestService
} from './support.service'
import { SupportGateway } from './support.gateway'
import {
  SupportRequest,
  SupportRequestSchema
} from './schemas/support-requests.schema'
import { SupportController } from './support.controller'
import { Message, MessageSchema } from './schemas/message.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema }
    ])
  ],
  controllers: [SupportController],
  providers: [
    SupportGateway,
    SupportRequestClientService,
    SupportRequestService
  ],
  exports: [SupportRequestClientService, SupportRequestService]
})
export class SupportModule {}
