import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserType } from "./user-type.enum";
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class User extends Document {
  @Prop({ required: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true, enum: UserType })
  type: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);