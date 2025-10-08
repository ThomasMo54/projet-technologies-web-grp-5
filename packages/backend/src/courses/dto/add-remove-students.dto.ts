import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddRemoveStudentsDto {
  @IsString({ each: true })
  @ApiProperty({ example: ['5fd40ffd-9edf-4d28-b16d-68b21c79403d', '071d9e3f-9155-4658-a24e-69c57cdcfa45'] })
  students?: string[];
}