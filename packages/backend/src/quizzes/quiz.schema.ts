import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: [String] })
  options: string[]; // Tableau d'options (par exemple, ["A", "B", "C", "D"])

  @Prop({ required: true })
  correctOption: number; // Index de l'option correcte dans le tableau options
}

@Schema()
export class Quiz extends Document {
  @Prop({ required: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: [Question] })
  questions: Question[]; // Tableau de questions

  @Prop({ required: true })
  chapterId: string; // UUID du chapitre auquel le quiz est lié

  @Prop({ required: true })
  creatorId: string; // UUID de l'utilisateur qui a créé le quiz
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);