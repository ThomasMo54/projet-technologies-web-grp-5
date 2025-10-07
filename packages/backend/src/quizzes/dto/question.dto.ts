import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class QuestionDto {
  @IsString()
  @ApiProperty({ example: 'MySQL is a relational database' })
  text: string;

  @IsString({ each: true })
  @ApiProperty({ example: ['True', 'False'] })
  options: string[];

  @IsNumber()
  @ApiProperty({ example: 0, description: 'Index of the correct option in the options array' })
  correctOption: number;
}