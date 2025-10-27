import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addChapter, updateChapter } from '../../api/chapters';
import Button from '../common/Button';
import type { CreateChapterDto, UpdateChapterDto, IChapter } from '../../interfaces/chapter';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const createChapterSchema = z.object({
  title: z.string().min(5, 'Minimum 5 characters (excluding spaces)'),
  courseId: z.string().min(1, 'Course ID is required'),
  content: z.string().optional(),
});

const updateChapterSchema = z.object({
  title: z.string().optional().refine((val) => !val || val.trim().length >= 5, {
    message: 'Minimum 5 characters (excluding spaces)',
  }),
  courseId: z.string().optional(),
  content: z.string().optional(),
});

const chapterSchema = z.union([createChapterSchema, updateChapterSchema]);

type ChapterFormData = CreateChapterDto | UpdateChapterDto;

interface ChapterFormProps {
  courseId: string;
  chapter?: IChapter;
  onSuccess: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ courseId, chapter, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    mode: 'onChange',
    defaultValues: chapter
      ? { title: chapter.title, courseId: chapter.courseId, content: chapter.content }
      : { courseId, title: '', content: '' },
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const content = watch('content');

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
        placeholder: 'Write your chapter content with formatting...',
      });

      if (content) {
        quill.root.innerHTML = content;
      }

      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        setValue('content', html === '<p><br></p>' ? '' : html);
        trigger('content');
      });

      quillRef.current = quill;
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content || '';
    }
  }, [content]);

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

  const getBorderClass = (hasError: boolean) =>
    hasError ? '!border-red-500 !ring-red-500 ring-2' : 'border-gray-300 dark:border-gray-600 ring-blue-500';

  return (
    <div className="relative max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chapter Title
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('title')}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 ${getBorderClass(!!errors.title)}`}
              placeholder="Enter chapter title"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div className={`border-2 rounded-lg overflow-hidden bg-white dark:bg-gray-700 transition-all duration-200 ${getBorderClass(!!errors.content)}`}>
            <div ref={editorRef} className="h-64" style={{ minHeight: '256px' }} />
          </div>
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`w-full flex items-center justify-center gap-2 font-medium rounded-lg py-3 transition-all duration-200 shadow-md hover:shadow-lg ${
            isValid && !isSubmitting
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          <FileText size={20} />
          {isSubmitting ? 'Saving...' : chapter ? 'Update Chapter' : 'Create Chapter'}
        </Button>
      </form>
    </div>
  );
};

export default ChapterForm;
