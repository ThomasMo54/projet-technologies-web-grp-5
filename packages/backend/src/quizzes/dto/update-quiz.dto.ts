import { CreateQuizDto } from "./create-quiz.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}