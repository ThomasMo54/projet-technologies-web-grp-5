import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchQuizByChapter, deleteQuiz } from '../../api/quizzes';
import Button from '../common/Button';
import Modal from '../common/Modal';
import QuizForm from '../forms/QuizForm';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, FileQuestion, Eye, Check } from 'lucide-react';
import type { IQuiz } from '../../interfaces/quiz';

interface QuizSectionProps {
  courseId: string;
  chapterId: string;
}

// Composant pour visualiser le quiz
const QuizViewer: React.FC<{ quiz: IQuiz; onClose: () => void }> = ({ quiz, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctOption) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="p-6 text-center">
        <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
          percentage >= 70 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
        }`}>
          <span className={`text-4xl font-bold ${
            percentage >= 70 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
          }`}>
            {percentage}%
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {percentage >= 70 ? '🎉 Félicitations !' : '📚 Continuez à apprendre !'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Vous avez obtenu {score} sur {totalQuestions} bonnes réponses
        </p>
        <Button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg px-6 py-3"
        >
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Progression */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} sur {totalQuestions}</span>
          <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {question.text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <Check size={16} className="text-white" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Annuler
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-6 py-2.5"
        >
          <span>{currentQuestion < totalQuestions - 1 ? 'Suivant' : 'Terminer'}</span>
        </Button>
      </div>
    </div>
  );
};

const QuizSection: React.FC<QuizSectionProps> = ({ courseId, chapterId }) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewingQuiz, setViewingQuiz] = useState(false);

  // Charger le quiz du chapitre
  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', chapterId],
    queryFn: () => fetchQuizByChapter(chapterId),
  });

  const handleAdd = () => {
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEdit = () => {
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleView = () => {
    setViewingQuiz(true);
  };

  const handleDelete = async () => {
    if (!quiz) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) return;

    try {
      await deleteQuiz(quiz.uuid);
      queryClient.invalidateQueries({ queryKey: ['quiz', chapterId] });
      toast.success('Quiz supprimé !');
    } catch (error) {
      toast.error('Échec de la suppression du quiz');
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setIsEdit(false);
  };

  const handleCloseViewer = () => {
    setViewingQuiz(false);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['quiz', chapterId] });
    handleClose();
    toast.success(isEdit ? 'Quiz mis à jour !' : 'Quiz ajouté !');
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <FileQuestion size={18} className="text-purple-500 dark:text-purple-400" />
          <h5 className="text-md font-semibold text-gray-900 dark:text-white">Quiz</h5>
        </div>
        
        {!quiz && !isLoading && (
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg text-sm"
          >
            <PlusCircle size={16} />
            Ajouter
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement du quiz...</p>
        </div>
      ) : quiz ? (
        <div className="relative p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h6 className="font-semibold text-gray-900 dark:text-white mb-1">
                {quiz.title}
              </h6>
              <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FileQuestion size={14} />
                  {quiz.questions?.length || 0} question(s)
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleView}
                className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                title="Consulter"
              >
                <Eye size={18} className="text-purple-600 dark:text-purple-400" />
              </button>
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit size={18} className="text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <FileQuestion size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Aucun quiz pour ce chapitre.</p>
        </div>
      )}

      {/* Modal pour ajouter/modifier le quiz */}
      <Modal 
        isOpen={modalOpen} 
        onClose={handleClose} 
        title={isEdit ? 'Modifier le quiz' : 'Ajouter un quiz'}
      >
        <QuizForm 
          courseId={courseId} 
          chapterId={chapterId} 
          quiz={isEdit ? (quiz ?? undefined) : undefined}
          onSuccess={handleSuccess} 
        />
      </Modal>

      {/* Modal pour consulter le quiz */}
      <Modal 
        isOpen={viewingQuiz} 
        onClose={handleCloseViewer} 
        title={quiz?.title || 'Quiz'}
      >
        {quiz && <QuizViewer quiz={quiz} onClose={handleCloseViewer} />}
      </Modal>
    </div>
  );
};

export default QuizSection;