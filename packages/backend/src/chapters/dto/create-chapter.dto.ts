import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChapterDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Database Fundamentals' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'This chapter covers the basics of databases...' })
  content?: string;

  @IsString()
  courseId: string;

  @IsString()
  quizId?: string;
}