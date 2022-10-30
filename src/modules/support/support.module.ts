import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportService } from './support.service'
import { SupportGateway } from './support.gateway'
import {
  SupportRequest,
  SupportRequestSchema
} from './schemas/support-requests.schema'
import { SupportController } from './support.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema }
    ])
  ],
  controllers: [SupportController],
  providers: [SupportGateway, SupportService],
  exports: [SupportService]
})
export class SupportModule {}
