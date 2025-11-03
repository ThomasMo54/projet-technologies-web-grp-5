import api from './axios';
import type { IQuiz, IQuizAnswer } from '../interfaces/quiz';
import type { CreateQuizDto, UpdateQuizDto } from '../interfaces/quiz';

/**
 * Récupère le quiz associé à un chapitre
 * @returns Le quiz ou null si aucun quiz n'existe
 */
export const fetchQuizByChapter = async (chapterId: string): Promise<IQuiz | null> => {
  try {
    const response = await api.get(`/chapters/${chapterId}/quiz`);
    return response.data;
  } catch (error: any) {
    // Retourne null si le chapitre n'a pas de quiz
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Crée un nouveau quiz
 */
export const createQuiz = async (data: CreateQuizDto): Promise<IQuiz> => {
  const response = await api.post('/quizzes', data);
  return response.data;
};

/**
 * Met à jour un quiz existant
 */
export const updateQuiz = async (uuid: string, data: UpdateQuizDto): Promise<IQuiz> => {
  const response = await api.put(`/quizzes/${uuid}`, data);
  return response.data;
};

/**
 * Supprime un quiz
 */
export const deleteQuiz = async (uuid: string): Promise<void> => {
  await api.delete(`/quizzes/${uuid}`);
};

/**
 * Soumet les réponses d'un utilisateur à un quiz
 * @param answers - Tableau d'indices des réponses sélectionnées
 */
export const submitQuizAnswer = async (quizId: string, answers: number[], userId: string): Promise<IQuizAnswer> => {
  const response = await api.post(`/quizzes/${quizId}/answers`, {
    quizId,
    userId,
    answers,
  });
  return response.data;
};

/**
 * Récupère les réponses d'un utilisateur pour un quiz
 * @returns Les réponses ou null si l'utilisateur n'a pas encore répondu
 */
export const fetchUserQuizAnswer = async (quizId: string, userId: string): Promise<IQuizAnswer | null> => {
  try {
    const response = await api.get(`/quizzes/${quizId}/answers/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Récupère toutes les réponses soumises pour un quiz (pour les statistiques professeur)
 */
export const fetchAllQuizAnswers = async (quizId: string): Promise<IQuizAnswer[]> => {
  const response = await api.get(`/quizzes/${quizId}/answers`);
  return response.data;
};