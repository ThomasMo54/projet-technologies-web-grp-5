import api from './axios';
import type { IQuiz } from '../interfaces/quiz';
import type { CreateQuizDto, UpdateQuizDto } from '../interfaces/quiz';

export const fetchQuizzesByChapter = async (chapterId: string): Promise<IQuiz[]> => {
  const response = await api.get(`/chapter/${chapterId}/quiz`);
  return response.data;
};

export const addQuiz = async (data: CreateQuizDto): Promise<IQuiz> => {
  const response = await api.post('/quizzes', data);
  return response.data;
};

export const updateQuiz = async (uuid: string, data: UpdateQuizDto): Promise<IQuiz> => {
  const response = await api.put(`/quizzes/${uuid}`, data);
  return response.data;
};

export const deleteQuiz = async (uuid: string): Promise<void> => {
  await api.delete(`/quizzes/${uuid}`);
};