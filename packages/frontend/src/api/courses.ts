import api from './axios';
import type { ICourse } from '../interfaces/course';
import type { IStudent } from '../interfaces/student';
import type { CreateCourseDto, UpdateCourseDto } from '../interfaces/course';

export const fetchTeacherCourses = async (creatorId: string): Promise<ICourse[]> => {
  const response = await api.get(`/courses/creator/${creatorId}`);
  return response.data;
};

export const fetchEnrolledCourses = async (studentId: string): Promise<ICourse[]> => {
  const response = await api.get(`/courses/student/${studentId}`);
  return response.data;
};

export const fetchCourseById = async (uuid: string): Promise<ICourse> => {
  const response = await api.get(`/courses/${uuid}`);
  return response.data;
};

export const createCourse = async (data: CreateCourseDto): Promise<ICourse> => {
  const response = await api.post('/courses', data);
  return response.data;
};

export const updateCourse = async (uuid: string, data: UpdateCourseDto): Promise<ICourse> => {
  const response = await api.put(`/courses/${uuid}`, data);
  return response.data;
};

export const deleteCourse = async (uuid: string): Promise<void> => {
  await api.delete(`/courses/${uuid}`);
};

export const fetchEnrolledStudent = async (studentId: string): Promise<IStudent> => {
  const response = await api.get(`/users/${studentId}`); 
  return response.data;
};