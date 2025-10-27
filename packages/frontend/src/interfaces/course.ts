import type { IChapter } from './chapter';
import type { IComment } from './comment';

export interface ICourse {
  _id: string;
  uuid: string;
  title: string;
  description?: string;
  chapters?: IChapter[];
  tags?: string[];
  published: boolean;
  creatorId: string;
  students?: string[];
  comments?: IComment[];
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  chapters?: string[];
  tags?: string[];
  published: boolean;
  creatorId: string;
  students?: string[];
  comments?: string[];
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  chapters?: string[];
  tags?: string[];
  published?: boolean;
  creatorId?: string;
  students?: string[];
  comments?: string[];
}