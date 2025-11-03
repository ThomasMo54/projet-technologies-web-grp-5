import api from './axios';
import type { ICourse } from '../interfaces/course';
import type { IStudent } from '../interfaces/student';
import type { CreateCourseDto, UpdateCourseDto } from '../interfaces/course';

/**
 * Récupère tous les cours créés par un professeur
 */
export const fetchTeacherCourses = async (creatorId: string): Promise<ICourse[]> => {
  const response = await api.get(`/courses/creator/${creatorId}`);
  return response.data;
};

/**
 * Récupère tous les cours auxquels un étudiant est inscrit
 */
export const fetchEnrolledCourses = async (studentId: string): Promise<ICourse[]> => {
  const response = await api.get(`/courses/student/${studentId}`);
  return response.data;
};

/**
 * Récupère les détails d'un cours spécifique
 */
export const fetchCourseById = async (uuid: string): Promise<ICourse> => {
  const response = await api.get(`/courses/${uuid}`);
  return response.data;
};

/**
 * Crée un nouveau cours
 */
export const createCourse = async (data: CreateCourseDto): Promise<ICourse> => {
  const response = await api.post('/courses', data);
  return response.data;
};

/**
 * Met à jour un cours existant
 */
export const updateCourse = async (uuid: string, data: UpdateCourseDto): Promise<ICourse> => {
  const response = await api.put(`/courses/${uuid}`, data);
  return response.data;
};

/**
 * Supprime un cours
 */
export const deleteCourse = async (uuid: string): Promise<void> => {
  await api.delete(`/courses/${uuid}`);
};

/**
 * Récupère les informations d'un étudiant inscrit
 */
export const fetchEnrolledStudent = async (studentId: string): Promise<IStudent> => {
  const response = await api.get(`/users/${studentId}`); 
  return response.data;
};

/**
 * Inscrit un étudiant à un cours
 */
export const enrollCourse = async (courseId: string, studentId: string): Promise<void> => {
  await api.put(`/courses/${courseId}/enroll`, { students: [studentId] });
};

/**
 * Désinscrit un étudiant d'un cours
 */
export const unenrollCourse = async (courseId: string, studentId: string): Promise<void> => {
  await api.delete(`/courses/${courseId}/unenroll`, { data: { students: [studentId] } });
};

/**
 * Récupère la liste complète de tous les cours disponibles
 */
export const fetchAllCourses = async (): Promise<ICourse[]> => {
  const response = await api.get('/courses');
  return response.data;
};

/**
 * Envoie une question au chatbot IA 
 */
export const askCourseQuestion = async (courseId: string, question: string): Promise<string> => {
  const response = await api.get(`/courses/${courseId}/chat`, {
    params: { question }
  });
  return response.data;
};