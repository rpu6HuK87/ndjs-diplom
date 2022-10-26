import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SupportService } from './support.service'
import { SupportGateway } from './support.gateway'
import {
  SupportRequest,
  SupportRequestSchema
} from './schemas/support-requests.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema }
    ])
  ],
  providers: [SupportGateway, SupportService],
  exports: [SupportService]
})
export class SupportModule {}
