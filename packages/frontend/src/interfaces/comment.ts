export interface IComment {
  uuid: string;  
  content: string;
  courseId: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;  
}