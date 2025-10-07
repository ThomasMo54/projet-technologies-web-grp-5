import api from './axios';
import type { IStat } from '../interfaces/stat';

export const fetchCourseStats = async (courseId: string): Promise<IStat[]> => {
  const response = await api.get(`/courses/${courseId}/stats`);
  return response.data;
};

export const fetchAllStats = async (creatorId: string): Promise<IStat[]> => {
  const response = await api.get(`/stats/creator/${creatorId}`);
  return response.data;
};