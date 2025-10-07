import { CreateChapterDto } from "./create-chapter.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}