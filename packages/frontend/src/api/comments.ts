import api from './axios';
import type { IComment } from '../interfaces/comment';

/**
 * Récupère tous les commentaires d'un cours
 */
export const fetchComments = async (courseId: string): Promise<IComment[]> => {
  const response = await api.get(`/courses/${courseId}/comments`);
  return response.data;
};

/**
 * Ajoute un commentaire sur un cours
 */
export const addComment = async (courseId: string, content: string, userId: string): Promise<IComment> => {
  const response = await api.post('/comments', { content, courseId, userId });
  return response.data;
};

/**
 * Supprime un commentaire
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

/**
 * Récupère les informations d'un utilisateur (pour afficher l'auteur d'un commentaire)
 */
export const fetchUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};