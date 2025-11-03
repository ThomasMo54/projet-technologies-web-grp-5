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

/**
 * Récupère les statistiques d'un cours (inscriptions, progression globale, etc.)
 */
export const fetchCourseStats = async (courseId: string) => {
  const response = await api.get(`/courses/${courseId}/stats`);
  return response.data;
};

/**
 * Récupère la progression d'un utilisateur spécifique dans un cours
 */
export const fetchUserCourseProgress = async (courseId: string, userId: string) => {
  const response = await api.get(`/courses/${courseId}/progress/${userId}`);
  return response.data;
};

/**
 * Récupère les statistiques globales d'un utilisateur (tous ses cours)
 */
export const fetchUserGlobalStats = async (userId: string): Promise<IUserStats> => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

/**
 * Récupère la progression détaillée d'un utilisateur
 */
export const fetchUserProgress = async (userId: string) => {
  const response = await api.get(`/users/${userId}/progress`);
  return response.data;
};