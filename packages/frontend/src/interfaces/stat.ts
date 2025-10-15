export interface IStat {
  name: string;
  progress: number;  // % (0-100)
  studentId?: string;
  completedQuizzes?: number;
  totalQuizzes?: number;
}