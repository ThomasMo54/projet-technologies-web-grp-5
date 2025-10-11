import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { createQuiz, updateQuiz } from '../../api/quizzes';
import Button from '../common/Button';
import type { CreateQuizDto, UpdateQuizDto, IQuiz, IQuestion } from '../../interfaces/quiz';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { PlusCircle, Trash2, Check, FileQuestion } from 'lucide-react';

interface QuizFormProps {
  courseId: string;
  chapterId: string;
  quiz?: IQuiz;
  onSuccess: () => void;
}

interface QuizFormData {
  title: string;
  questions: IQuestion[];
}

const QuizForm: React.FC<QuizFormProps> = ({ chapterId, quiz, onSuccess }) => {
  const { user } = useAuth();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<QuizFormData>({
    defaultValues: quiz 
      ? {
          title: quiz.title,
          questions: quiz.questions,
        }
      : {
          title: '',
          questions: [{ text: '', options: ['', '', '', ''], correctOption: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormData) => {
    try {
      // Validation des questions
      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        if (!q.text.trim()) {
          toast.error(`Le texte de la question ${i + 1} est requis`);
          return;
        }
        if (q.options.some(opt => !opt.trim())) {
          toast.error(`Toutes les options de la question ${i + 1} doivent être remplies`);
          return;
        }
        if (q.correctOption < 0 || q.correctOption >= q.options.length) {
          toast.error(`Option correcte invalide pour la question ${i + 1}`);
          return;
        }
      }

      if (quiz) {
        // Mode édition
        const updateData: UpdateQuizDto = {
          title: data.title,
          questions: data.questions,
        };
        await updateQuiz(quiz.uuid, updateData);
      } else {
        // Mode création
        if (!user?.id) {
          toast.error('Utilisateur non authentifié');
          return;
        }
        const createData: CreateQuizDto = {
          title: data.title,
          questions: data.questions,
          chapterId: chapterId,
          creatorId: user.id,
        };
        await createQuiz(createData);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du quiz:', error);
      const errorMessage = error?.response?.data?.message || 'Échec de la sauvegarde du quiz';
      toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Zone de formulaire scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titre du Quiz
          </label>
          <div className="relative">
            <FileQuestion className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('title', { required: 'Le titre est requis' })}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Ex: Quiz sur React"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Questions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Questions</h4>
            <Button
              type="button"
              onClick={() => append({ text: '', options: ['', '', '', ''], correctOption: 0 })}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 text-sm shadow-md hover:shadow-lg"
            >
              <PlusCircle size={16} />
              Ajouter
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border-2 border-gray-200 dark:border-gray-600 p-5 mb-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-700 dark:to-blue-900/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  Question {index + 1}
                </h5>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texte de la question
                </label>
                <input
                  {...register(`questions.${index}.text`, { required: 'Le texte de la question est requis' })}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Entrez votre question"
                />
              </div>

              {/* Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Options de réponse
                </label>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {optIndex + 1}
                      </span>
                      <input
                        {...register(`questions.${index}.options.${optIndex}`, { required: 'L\'option est requise' })}
                        className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Réponse correcte
                </label>
                <select
                  {...register(`questions.${index}.correctOption`, {
                    required: 'La réponse correcte est requise',
                    valueAsNumber: true,
                  })}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <FileQuestion size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucune question. Ajoutez-en une pour commencer.
              </p>
            </div>
          )}
        </div>

        {/* Consignes */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            💡 <strong>Conseils :</strong> Créez des questions claires avec 4 options. Sélectionnez la bonne réponse pour chaque question.
          </p>
        </div>
      </div>

      {/* Submit Button - Fixé en bas */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg py-3 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Check size={20} />
          <span>{quiz ? 'Mettre à jour le quiz' : 'Créer le quiz'}</span>
        </Button>
      </div>
    </div>
  );
};

export default QuizForm;