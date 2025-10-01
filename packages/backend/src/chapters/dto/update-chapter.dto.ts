import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChapterDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Database Fundamentals' })
  title?: string;

  @IsString()
  content?: string;

  @IsString()
  courseId?: string;

  @IsString()
  quizId?: string;
}