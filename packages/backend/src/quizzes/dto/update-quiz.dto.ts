import { OmitType } from "@nestjs/swagger";
import { CreateQuizDto } from "./create-quiz.dto";

export class UpdateQuizDto extends OmitType(CreateQuizDto, ['chapterId'] as const) {}