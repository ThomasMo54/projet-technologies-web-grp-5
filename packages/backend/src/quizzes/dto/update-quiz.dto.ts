export class QuestionDto {
  text?: string;
  options?: string[];
  correctOption?: number;
}

export class UpdateQuizDto {
  title?: string;
  questions?: QuestionDto[];
  chapterId?: string;
}