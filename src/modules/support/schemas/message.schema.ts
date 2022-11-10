import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { UserDocument } from 'src/modules/users/schemas/user.schema'

export type MessageDocument = Message & Document

@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  author: UserDocument

  @Prop({ required: true, type: Date, default: Date.now() })
  sentAt: string

  @Prop({ required: true, type: String })
  text: string

  @Prop({ type: Date })
  readAt: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
