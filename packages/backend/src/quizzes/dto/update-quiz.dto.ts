import { IsNumber, IsString, MaxLength, ValidateNested } from "class-validator";
import { QuestionDto } from "./question.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateQuizDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Database Quizz' })
  title?: string;

  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ApiProperty({ type: [QuestionDto] })
  questions?: QuestionDto[];

  @IsString()
  chapterId?: string;
}