import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Course extends Document {
  @Prop({ required: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [{ type: String }], default: [] })
  chapters: string[]; // Liste des UUIDs des chapitres

  @Prop({ type: [{ type: String }], default: [] })
  tags: string[]; // Liste de tags pour catégoriser le cours

  @Prop({ required: true })
  creatorId: string; // UUID de l'utilisateur qui a créé le cours

  @Prop({ type: [{ type: String }], default: [] })
  students: string[]; // Liste des UUIDs des étudiants inscrits

  @Prop({ type: [{ type: String }], default: [] })
  comments: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);