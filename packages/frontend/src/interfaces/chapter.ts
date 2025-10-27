
export interface IChapter {
  uuid: string;
  title: string;
  content?: string;
  summary?: string;
  courseId: string;
  quizId?: string;
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