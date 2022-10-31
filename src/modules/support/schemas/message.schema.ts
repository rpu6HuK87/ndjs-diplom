import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type MessageDocument = Message & Document

@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId })
  author: Types.ObjectId

  @Prop({ required: true, type: Date, default: Date.now() })
  sentAt: string

  @Prop({ required: true, type: String })
  text: string

  @Prop({ type: Date })
  readAt: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
