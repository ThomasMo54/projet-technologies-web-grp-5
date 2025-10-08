import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Comment extends Document {
  @Prop({ required: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: () => new Date().toISOString() })
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);