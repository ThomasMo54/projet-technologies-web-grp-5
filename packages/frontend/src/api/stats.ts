import api from './axios';

export interface ICourseProgress {
  courseId: string;
  courseTitle: string;
  totalChapters: number;
  completedChapters: number;
  progressPercentage: number;
  quizzesPassed: number;
  quizzesFailed: number;
}

export interface IUserStats {
  userId: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  overallProgressPercentage: number;
  courses: ICourseProgress[];
}

// Récupérer les stats d'un cours
export const fetchCourseStats = async (courseId: string) => {
  const response = await api.get(`/courses/${courseId}/stats`);
  return response.data;
};

// Récupérer la progression d'un utilisateur dans un cours
export const fetchUserCourseProgress = async (courseId: string, userId: string) => {
  const response = await api.get(`/courses/${courseId}/progress/${userId}`);
  return response.data;
};

// Récupérer les stats globales d'un utilisateur
export const fetchUserGlobalStats = async (userId: string): Promise<IUserStats> => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

// Récupérer la progression globale d'un utilisateur
export const fetchUserProgress = async (userId: string) => {
  const response = await api.get(`/users/${userId}/progress`);
  return response.data;
};