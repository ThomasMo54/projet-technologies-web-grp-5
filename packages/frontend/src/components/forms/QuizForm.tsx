import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { addQuiz, updateQuiz } from '../../api/quizzes';
import Button from '../common/Button';
import type { CreateQuizDto, UpdateQuizDto, IQuiz } from '../../interfaces/quiz';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface QuizFormProps {
  courseId: string;
  chapterId: string;
  quiz?: IQuiz;
  onSuccess: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({chapterId, quiz, onSuccess }) => {
  const { user } = useAuth();
  const { register, handleSubmit, control } = useForm<CreateQuizDto | UpdateQuizDto>({
    defaultValues: quiz || { questions: [{ text: '', options: ['', '', '', ''], correctOption: 0 }], chapterId },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: CreateQuizDto | UpdateQuizDto) => {
    try {
      if (quiz) {
        await updateQuiz(quiz.uuid, data as UpdateQuizDto);
      } else {
        await addQuiz({ ...data, chapterId, creatorId: user!.id } as CreateQuizDto);
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save quiz');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('title')} className="w-full p-2 border rounded" placeholder="Title" required />
      <div>
        <h4 className="text-lg">Questions</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 mb-2 rounded">
            <input
              {...register(`questions.${index}.text`)}
              className="w-full p-2 border rounded mb-2"
              placeholder="Question text"
            />
            {field.options.map((_, optIndex) => (
              <input
                key={optIndex}
                {...register(`questions.${index}.options.${optIndex}`)}
                className="w-full p-2 border rounded mb-2"
                placeholder={`Option ${optIndex + 1}`}
              />
            ))}
            <input
              {...register(`questions.${index}.correctOption`)}
              type="number"
              className="w-full p-2 border rounded mb-2"
              placeholder="Correct option (0-3)"
            />
            <Button type="button" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600">Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ text: '', options: ['', '', '', ''], correctOption: 0 })}>
          Add Question
        </Button>
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default QuizForm;