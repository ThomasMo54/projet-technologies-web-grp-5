import { OmitType } from "@nestjs/swagger";
import { CreateChapterDto } from "./create-chapter.dto";

export class UpdateChapterDto extends OmitType(CreateChapterDto, ['courseId', 'quizId'] as const) {}