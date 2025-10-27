import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createQuiz, updateQuiz } from '../../api/quizzes';
import Button from '../common/Button';
import type { CreateQuizDto, UpdateQuizDto, IQuiz } from '../../interfaces/quiz';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { PlusCircle, Trash2, Check, FileQuestion } from 'lucide-react';

const optionSchema = z.string();

const questionSchema = z
  .object({
    text: z
      .string()
      .min(5, 'Question must have at least 5 characters')
      .refine((val) => val.trim().length >= 5, {
        message: 'Question must have at least 5 valid characters',
      }),
    options: z
      .array(optionSchema)
      .length(4, 'Each question must have 4 options')
      .refine(
        (opts) => opts.filter((opt) => opt.trim() !== '').length >= 2,
        'At least 2 options must be filled'
      ),
    correctOption: z
      .number()
      .refine(
        (val) => val >= 0 && val < 4,
        'Correct option must refer to an existing option'
      ),
  })
  .refine(
    (q) =>
      q.options[q.correctOption] &&
      q.options[q.correctOption].trim() !== '',
    {
      message: 'Correct option must refer to a filled answer',
      path: ['correctOption'],
    }
  );

const quizSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must have at least 5 characters')
    .refine((val) => val.trim().length >= 5, {
      message: 'Title must have at least 5 valid characters',
    }),
  questions: z
    .array(questionSchema)
    .min(1, 'Quiz must have at least one question'),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormProps {
  courseId: string;
  chapterId: string;
  quiz?: IQuiz;
  onSuccess: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ chapterId, quiz, onSuccess }) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    mode: 'onChange',
    defaultValues: quiz
      ? { title: quiz.title, questions: quiz.questions }
      : {
          title: '',
          questions: [
            { text: '', options: ['', '', '', ''], correctOption: 0 },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormData) => {
    try {
      if (quiz) {
        const updateData: UpdateQuizDto = {
          title: data.title,
          questions: data.questions,
        };
        await updateQuiz(quiz.uuid, updateData);
      } else {
        if (!user?.id) {
          toast.error('User not authenticated');
          return;
        }
        const createData: CreateQuizDto = {
          title: data.title,
          questions: data.questions,
          chapterId,
          creatorId: user.id,
        };
        await createQuiz(createData);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to save quiz';
      toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

        {/* Quiz Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quiz Title
          </label>
          <div className="relative">
            <FileQuestion
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              {...register('title')}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.title
                  ? '!border-red-500 !ring-red-500 ring-2'
                  : 'border-gray-300 dark:border-gray-600 ring-blue-500'
              }`}
              placeholder="Enter quiz title"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Questions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Questions
            </h4>
            <Button
              type="button"
              onClick={() =>
                append({ text: '', options: ['', '', '', ''], correctOption: 0 })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 text-sm shadow-md hover:shadow-lg"
            >
              <PlusCircle size={16} />
              Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border-2 border-gray-200 dark:border-gray-600 p-5 mb-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-700 dark:to-blue-900/10"
            >
              {/* Question Header */}
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  Question {index + 1}
                </h5>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete question"
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Text
                </label>
                <input
                  {...register(`questions.${index}.text`)}
                  className={`w-full p-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 ${
                    errors.questions?.[index]?.text
                      ? '!border-red-500 !ring-red-500 ring-2'
                      : 'border-gray-300 dark:border-gray-600 ring-blue-500'
                  }`}
                  placeholder="Enter your question"
                />
                {errors.questions?.[index]?.text && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.questions[index]?.text?.message}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer Options
                </label>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {optIndex + 1}
                      </span>
                      <input
                        {...register(`questions.${index}.options.${optIndex}`)}
                        className={`flex-1 p-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 ${
                          errors.questions?.[index]?.options?.[optIndex]
                            ? '!border-red-500 !ring-red-500 ring-2'
                            : 'border-gray-300 dark:border-gray-600 ring-blue-500'
                        }`}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {errors.questions?.[index]?.options && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.questions[index]?.options?.message as string}
                  </p>
                )}
              </div>

              {/* Correct Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correct Answer
                </label>
                <select
                  {...register(`questions.${index}.correctOption`, {
                    valueAsNumber: true,
                  })}
                  className={`w-full p-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 ${
                    errors.questions?.[index]?.correctOption
                      ? '!border-red-500 !ring-red-500 ring-2'
                      : 'border-gray-300 dark:border-gray-600 ring-blue-500'
                  }`}
                >
                  {[0, 1, 2, 3].map((opt) => (
                    <option key={opt} value={opt}>
                      Option {opt + 1}
                    </option>
                  ))}
                </select>
                {errors.questions?.[index]?.correctOption && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.questions[index]?.correctOption?.message}
                  </p>
                )}
              </div>
            </div>
          ))}
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
          <Check size={20} />
          {isSubmitting ? 'Saving...' : quiz ? 'Update Quiz' : 'Create Quiz'}
        </Button>
      </form>

      {/* Hover Border */}
      <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default QuizForm;
