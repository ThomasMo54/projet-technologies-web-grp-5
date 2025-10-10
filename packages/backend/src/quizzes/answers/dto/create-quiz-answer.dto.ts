import { IsInt, IsString } from "class-validator";

export class CreateQuizAnswerDto {
  @IsString()
  quizId: string;

  @IsString()
  userId: string;

  @IsInt({ each: true })
  answers: number[];
}