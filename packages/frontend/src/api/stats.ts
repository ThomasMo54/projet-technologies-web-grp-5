import api from './axios';
import type { IStat } from '../interfaces/stat';

export const fetchCourseStats = async (courseId: string): Promise<IStat[]> => {
  const response = await api.get(`/courses/${courseId}/stats`);
  return response.data;
};

// Pour tous les stats d'un creator (ex. dashboard global ; mock pour l'instant)
export const fetchAllStats = async (): Promise<IStat[]> => {
  // TODO: Ajouter endpoint backend /courses/creator/:id/stats (agrège tous les cours)
  // Pour l'instant, retourne vide ou mock
  return [];  // Ou implémente si besoin
};