import api from './axios';
import type { IComment } from '../interfaces/comment';

export const fetchComments = async (courseId: string): Promise<IComment[]> => {
  const response = await api.get(`/courses/${courseId}/comments`);
  return response.data;
};

export const addComment = async (courseId: string, content: string, userId: string): Promise<IComment> => {
  const response = await api.post('/comments', { content, courseId, userId });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

export const fetchUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};