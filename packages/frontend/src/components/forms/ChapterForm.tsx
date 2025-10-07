import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addChapter, updateChapter } from '../../api/chapters';
import Button from '../common/Button';
import type { CreateChapterDto, UpdateChapterDto, IChapter } from '../../interfaces/chapter';
import { toast } from 'react-toastify';
import { FileText, Book } from 'lucide-react';

// Define Zod schemas for Create and Update DTOs
const createChapterSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  courseId: z.string().min(1, 'Course ID is required'),
  content: z.string().optional(),
  quizId: z.string().optional(),
});

const updateChapterSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less').optional(),
  courseId: z.string().optional(),
  content: z.string().optional(),
  quizId: z.string().optional(),
});

// Union schema for both Create and Update
const chapterSchema = z.union([createChapterSchema, updateChapterSchema]);

// Type for the form, combining both DTOs
type ChapterFormData = CreateChapterDto | UpdateChapterDto;

interface ChapterFormProps {
  courseId: string;
  chapter?: IChapter;
  onSuccess: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ courseId, chapter, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: chapter
      ? { title: chapter.title, courseId: chapter.courseId, content: chapter.content, quizId: chapter.quizId }
      : { courseId, title: '', content: '', quizId: '' },
  });

  const onSubmit = async (data: ChapterFormData) => {
    try {
      if (chapter) {
        await updateChapter(chapter.uuid, data as UpdateChapterDto);
      } else {
        await addChapter({ ...data, courseId } as CreateChapterDto);
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save chapter');
    }
  };

  return (
    <div className="relative max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Title Input */}
        <div className="relative">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chapter Title
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('title')}
              id="title"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter chapter title"
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Content Textarea */}
        <div className="relative">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div className="relative">
            <Book className="absolute left-3 top-4 text-gray-400" size={20} />
            <textarea
              {...register('content')}
              id="content"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter chapter content"
              rows={4}
            />
          </div>
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>

        {/* Quiz ID Input */}
        <div className="relative">
          <label htmlFor="quizId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quiz ID (optional)
          </label>
          <div className="relative">
            <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('quizId')}
              id="quizId"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter quiz ID"
            />
          </div>
          {errors.quizId && <p className="text-red-500 text-xs mt-1">{errors.quizId.message}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg py-3 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FileText size={20} />
          Save Chapter
        </Button>
      </form>
      <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ChapterForm;