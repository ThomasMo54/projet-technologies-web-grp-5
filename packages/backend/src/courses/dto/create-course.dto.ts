export class CreateCourseDto {
  title: string;
  description?: string;
  chapters?: string[];
  tags?: string[];
  creatorId: string;
  students?: string[];
}