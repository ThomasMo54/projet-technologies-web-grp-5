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

const CourseForm: React.FC<CourseFormProps> = ({ course, creatorId, onSuccess }) => {
  const { register, handleSubmit } = useForm<CreateCourseDto | UpdateCourseDto>({
     defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          tags: course.tags ?? [],
          students: course.students ?? [],
          creatorId: course.creatorId,
        }
      : { title: '', description: '', tags: [], students: [], creatorId },
  });

  const onSubmit = async (data: CreateCourseDto | UpdateCourseDto) => {
    try {
      if (course) {
        await updateCourse(course.uuid, data as UpdateCourseDto);
      } else {
        await createCourse({ ...data, creatorId: creatorId! } as CreateCourseDto);
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('title')} className="w-full p-2 border rounded" placeholder="Title" required />
      <textarea {...register('description')} className="w-full p-2 border rounded" placeholder="Description" />
      <input {...register('tags')} className="w-full p-2 border rounded" placeholder="Tags (comma-separated)" />
      <input {...register('students')} className="w-full p-2 border rounded" placeholder="Student IDs (comma-separated)" />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default CourseForm;