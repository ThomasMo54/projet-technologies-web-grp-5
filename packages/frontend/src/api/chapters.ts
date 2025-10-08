import api from './axios';
import type { IChapter } from '../interfaces/chapter';
import type { CreateChapterDto, UpdateChapterDto } from '../interfaces/chapter';

export const fetchChaptersByCourse = async (courseId: string): Promise<IChapter[]> => {
  const response = await api.get(`/courses/${courseId}/chapters`);
  return response.data;
};

export const addChapter = async (data: CreateChapterDto): Promise<IChapter> => {
  const response = await api.post('/chapters', data);
  return response.data;
};

export const updateChapter = async (uuid: string, data: UpdateChapterDto): Promise<IChapter> => {
  const response = await api.put(`/chapters/${uuid}`, data);
  return response.data;
};

export const deleteChapter = async (uuid: string): Promise<void> => {
  await api.delete(`/chapters/${uuid}`);
};