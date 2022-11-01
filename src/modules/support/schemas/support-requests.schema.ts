import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'
import { UserDocument } from 'src/modules/users/schemas/user.schema'

import { Message } from './message.schema'

export type SupportRequestDocument = SupportRequest & Document

@Schema()
export class SupportRequest {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: UserDocument

  @Prop({ required: true, type: Date, default: Date.now() })
  createdAt: string

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  messages: Message[]

  @Prop({ type: Boolean, default: true })
  isActive: boolean
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest)
