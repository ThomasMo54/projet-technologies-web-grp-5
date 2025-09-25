import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Chapter extends Document {
  @Prop({ required: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  content: string; 

  @Prop({ required: true })
  courseId: string; // UUID du cours auquel le chapitre est lié

  @Prop({ required: false })
  quizId: string; // UUID du quiz lié au chapitre (optionnel)
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);