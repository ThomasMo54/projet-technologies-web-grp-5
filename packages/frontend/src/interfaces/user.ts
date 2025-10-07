export interface IUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  type: 'teacher' | 'student';
}