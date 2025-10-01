import { IsString, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { QuestionDto } from "./question.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQuizDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Database Quizz' })
  title: string;

  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ApiProperty({ type: [QuestionDto] })
  questions: QuestionDto[];

  @IsString()
  chapterId: string;

  @IsString()
  creatorId: string;
}