import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {

  @IsString()
  @MaxLength(500)
  @ApiProperty({ example: 'Hello world!' })
  content: string;

  @IsString()
  @ApiProperty({ example: 'c457caf6-aabb-4a6c-b996-f6becb75e48c' })
  courseId: string;

  @IsString()
  @ApiProperty({ example: 'd457caf6-aabb-4a6c-b996-f6becb75e48c' })
  userId: string;
}