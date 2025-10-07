import api from './axios';
import type { IQuiz } from '../interfaces/quiz';
import type { CreateQuizDto, UpdateQuizDto } from '../interfaces/quiz';

export const fetchQuizzesByChapter = async (chapterId: string): Promise<IQuiz[]> => {
  const response = await api.get(`/quizzes/chapter/${chapterId}`);
  return response.data;
};

export const addQuiz = async (data: CreateQuizDto): Promise<IQuiz> => {
  const response = await api.post('/quizzes', data);
  return response.data;
};

export const updateQuiz = async (id: string, data: UpdateQuizDto): Promise<IQuiz> => {
  const response = await api.put(`/quizzes/${id}`, data);
  return response.data;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await api.delete(`/quizzes/${id}`);
};