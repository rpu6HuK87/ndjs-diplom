import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'

import { Message } from './message.schema'

export type SupportRequestDocument = SupportRequest & Document

@Schema()
export class SupportRequest {
  @Prop({ required: true, type: Types.ObjectId })
  user: Types.ObjectId

  @Prop({ required: true, type: Date, default: Date.now() })
  createdAt: string

  @Prop({ type: Message, ref: 'Message' })
  messages: Message[]

  @Prop({ type: Boolean, default: true })
  isActive: boolean
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest)
