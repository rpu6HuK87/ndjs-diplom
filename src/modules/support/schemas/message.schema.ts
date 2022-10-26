import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date, Document, Types } from 'mongoose'

export type MessageDocument = Message & Document

@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId })
  author: Types.ObjectId

  @Prop({ required: true, type: String })
  sentAt: Date

  @Prop({ required: true, type: String })
  text: string

  @Prop({ type: String })
  readAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)
