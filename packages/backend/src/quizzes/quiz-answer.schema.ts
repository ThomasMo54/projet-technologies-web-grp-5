import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class QuizAnswer extends Document {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: [Number] })
  answers: number[];

  @Prop({ required: true })
  score: number;
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);