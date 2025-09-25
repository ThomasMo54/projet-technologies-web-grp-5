export class QuestionDto {
  text: string;
  options: string[];
  correctOption: number;
}

export class CreateQuizDto {
  title: string;
  questions: QuestionDto[];
  chapterId: string;
  creatorId: string;
}