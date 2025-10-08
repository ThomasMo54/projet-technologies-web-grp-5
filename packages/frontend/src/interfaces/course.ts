import type { IChapter } from './chapter';

export interface ICourse {
  _id: string;
  uuid: string;
  title: string;
  description?: string;
  chapters?: IChapter[];
  tags?: string[];
  creatorId: string;
  students?: string[];
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  chapters?: string[];
  tags?: string[];
  creatorId: string;
  students?: string[];
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  chapters?: string[];
  tags?: string[];
  creatorId?: string;
  students?: string[];
}