import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCourse, updateCourse } from '../../api/courses';
import Button from '../common/Button';
import type { CreateCourseDto, UpdateCourseDto, ICourse } from '../../interfaces/course';
import { toast } from 'react-toastify';
import { FileText, Tag } from 'lucide-react';

// Schéma Zod
const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .refine((val) => val.trim().length >= 5, {
      message: 'Minimum 5 characters (excluding spaces)',
    }),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: ICourse;
  creatorId?: string;
  onSuccess: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, creatorId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: 'onChange',
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      tags: course?.tags?.join(', ') || '',
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      if (course) {
        const updateData: UpdateCourseDto = {
          title: data.title,
          description: data.description,
          tags: tagsArray,
          comments: [],
        };
        await updateCourse(course.uuid, updateData);
      } else {
        if (!creatorId) {
          toast.error('Creator ID is required');
          return;
        }
        const createData: CreateCourseDto = {
          title: data.title,
          description: data.description,
          tags: tagsArray,
          creatorId,
          published: false,
          students: [],
          chapters: [],
          comments: [],
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

  const getBorderClass = (field: 'title' | 'tags') => {
    return errors[field]
      ? '!border-red-500 !ring-red-500 ring-2'
      : 'border-gray-300 dark:border-gray-600 ring-blue-500';
  };

  return (
    <div className="relative max-w-3xl mx-auto bg-white dark:bg-gray-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText size={18} />
            Title *
          </label>
          <input
            {...register('title', { onChange: () => trigger('title') })}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 ${getBorderClass(
              'title'
            )}`}
            placeholder="Ex: React for Beginners"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText size={18} />
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Describe your course..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Tag size={18} />
            Tags
          </label>
          <input
            {...register('tags', { onChange: () => trigger('tags') })}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 ${getBorderClass(
              'tags'
            )}`}
            placeholder="Ex: JavaScript, React, Web"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`flex-1 flex items-center justify-center gap-2 font-medium rounded-lg py-3 transition-all duration-200 shadow-md hover:shadow-lg ${
              isValid && !isSubmitting
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <FileText size={20} />
            {isSubmitting
              ? 'Saving...'
              : course
              ? 'Update Course'
              : 'Create Course'}
          </Button>
        </div>
      </form>

      <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none -z-10"></div>
    </div>
  );
};

export default CourseForm;
