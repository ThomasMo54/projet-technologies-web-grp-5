import React from 'react';
import { useForm } from 'react-hook-form';
import { createCourse, updateCourse } from '../../api/courses';
import Button from '../common/Button';
import type { CreateCourseDto, UpdateCourseDto, ICourse } from '../../interfaces/course';
import { toast } from 'react-toastify';

interface CourseFormProps {
  course?: ICourse;
  creatorId?: string;
  onSuccess: () => void;
}

interface CourseFormData {
  title: string;
  description: string;
  tags: string;
  students: string;
  chapters: string;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, creatorId, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      tags: course?.tags?.join(', ') || '',
      students: course?.students?.join(', ') || '',
      chapters: course?.chapters
        ? course.chapters.map(ch => typeof ch === 'string' ? ch : ch.uuid).join(', ')
        : '',
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      // Convertir les chaînes en tableaux
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      const studentsArray = data.students
        ? data.students.split(',').map(id => id.trim()).filter(id => id.length > 0)
        : [];

      const chaptersArray = data.chapters
        ? data.chapters.split(',').map(id => id.trim()).filter(id => id.length > 0)
        : [];

      if (course) {
        // Mode édition
        const updateData: UpdateCourseDto = {
          title: data.title,
          description: data.description,
          tags: tagsArray,
          students: studentsArray,
          chapters: chaptersArray,
        };
        await updateCourse(course.uuid, updateData);
      } else {
        // Mode création
        if (!creatorId) {
          toast.error('Creator ID is required');
          return;
        }
        const createData: CreateCourseDto = {
          title: data.title,
          description: data.description,
          tags: tagsArray,
          students: studentsArray,
          creatorId: creatorId,
          chapters: chaptersArray.length > 0 ? chaptersArray : [], // Tableau vide si pas de chapitres
        };
        await createCourse(createData);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving course:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to save course';
      toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Course title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Course description"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <input
          {...register('tags')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., JavaScript, React, Web Development"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Separate tags with commas
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Student IDs (optional)
        </label>
        <input
          {...register('students')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., student-uuid-1, student-uuid-2"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Separate student UUIDs with commas
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg"
        >
          {course ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;