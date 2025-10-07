import api from './axios';
import type { IComment } from '../interfaces/comment';

export const fetchComments = async (courseId: string): Promise<IComment[]> => {
  const response = await api.get(`/courses/${courseId}/comments`);
  return response.data;
};

export const addComment = async (courseId: string, content: string): Promise<IComment> => {
  const response = await api.post(`/courses/${courseId}/comments`, { content });
  return response.data;
};