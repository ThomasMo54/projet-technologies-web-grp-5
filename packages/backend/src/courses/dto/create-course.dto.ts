import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({ example: 'Database' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'This course covers the basics of databases...' })
  description?: string;

  @IsString({ each: true })
  chapters?: string[];

  @IsString({ each: true })
  @ApiProperty({ example: ['database', 'sql', 'nosql'] })
  tags?: string[];

  @IsString()
  creatorId: string;

  @IsString({ each: true })
  students?: string[];
}