export interface IQuestion {
  text: string;
  options: string[];
  correctOption: number;
}

export interface IQuiz {
  id: string;
  title: string;
  questions: IQuestion[];
  chapterId: string;
  creatorId: string;
}

export interface CreateQuizDto {
  title: string;
  questions: IQuestion[];
  chapterId: string;
  creatorId: string;
}

export interface UpdateQuizDto {
  title?: string;
  questions?: IQuestion[];
  chapterId?: string;
}