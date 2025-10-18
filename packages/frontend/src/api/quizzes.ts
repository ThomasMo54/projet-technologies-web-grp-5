import api from './axios';
import type { IQuiz, IQuizAnswer } from '../interfaces/quiz';
import type { CreateQuizDto, UpdateQuizDto } from '../interfaces/quiz';

// Récupérer le quiz d'un chapitre
export const fetchQuizByChapter = async (chapterId: string): Promise<IQuiz | null> => {
  try {
    const response = await api.get(`/chapters/${chapterId}/quiz`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Créer un quiz
export const createQuiz = async (data: CreateQuizDto): Promise<IQuiz> => {
  const response = await api.post('/quizzes', data);
  return response.data;
};

// Mettre à jour un quiz
export const updateQuiz = async (uuid: string, data: UpdateQuizDto): Promise<IQuiz> => {
  const response = await api.put(`/quizzes/${uuid}`, data);
  return response.data;
};

// Supprimer un quiz
export const deleteQuiz = async (uuid: string): Promise<void> => {
  await api.delete(`/quizzes/${uuid}`);
};

// Soumettre les réponses du quiz
export const submitQuizAnswer = async (quizId: string, answers: number[], userId: string): Promise<IQuizAnswer> => {
  const response = await api.post(`/quizzes/${quizId}/answers`, {
    quizId,
    userId,
    answers,
  });
  return response.data;
};

// Récupérer les réponses d'un utilisateur pour un quiz
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

// Récupérer toutes les réponses d'un quiz
export const fetchAllQuizAnswers = async (quizId: string): Promise<IQuizAnswer[]> => {
  const response = await api.get(`/quizzes/${quizId}/answers`);
  return response.data;
};