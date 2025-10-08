import type { IQuiz } from './quiz';

export interface IChapter {
  uuid: string;
  title: string;
  content?: string;
  courseId: string;
  quizId?: string;
  quizzes?: IQuiz[];
}

export interface CreateChapterDto {
  title: string;
  content?: string;
  courseId: string;
  quizId?: string;
}

export interface UpdateChapterDto {
  title?: string;
  content?: string;
  courseId?: string;
  quizId?: string;
}