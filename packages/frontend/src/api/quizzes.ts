import api from './axios';
import type { IQuiz } from '../interfaces/quiz';
import type { CreateQuizDto, UpdateQuizDto } from '../interfaces/quiz';

// Récupérer le quiz d'un chapitre (un seul quiz par chapitre)
export const fetchQuizByChapter = async (chapterId: string): Promise<IQuiz | null> => {
  try {
    const response = await api.get(`/chapters/${chapterId}/quiz`);
    return response.data;
  } catch (error: any) {
    // Si pas de quiz (404), retourner null
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Créer un quiz pour un chapitre
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