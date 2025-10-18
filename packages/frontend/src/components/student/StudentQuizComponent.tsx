import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { IQuiz, IQuestion } from '../../interfaces/quiz';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Button from '../common/Button';
import { submitQuizAnswer, fetchUserQuizAnswer } from '../../api/quizzes';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

interface StudentQuizComponentProps {
  quiz: IQuiz;
  onComplete?: (score: number) => void;
  viewResultsMode?: boolean;
}

const StudentQuizComponent: React.FC<StudentQuizComponentProps> = ({ 
  quiz, 
  onComplete,
  viewResultsMode = false 
}) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(viewResultsMode);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: IQuestion[] = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const passingScore = 70;

  const { data: previousAnswer, isLoading } = useQuery({
    queryKey: ['quizAnswer', quiz.uuid, user?.id],
    queryFn: () => fetchUserQuizAnswer(quiz.uuid, user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (viewResultsMode && previousAnswer) {
      setScore(previousAnswer.score);
      setSelectedAnswers(
        previousAnswer.answers.reduce((acc, answer, index) => ({
          ...acc,
          [index]: answer,
        }), {})
      );
      setShowResults(true);
    }
  }, [viewResultsMode, previousAnswer]);

  const submitMutation = useMutation({
    mutationFn: (answers: number[]) => submitQuizAnswer(quiz.uuid, answers, user!.id),
    onSuccess: (data) => {
      setScore(data.score);
      setShowResults(true);
      toast.success(`Quiz submitted! Score: ${data.score}%`);
      onComplete?.(data.score);
    },
    onError: () => {
      toast.error('Failed to submit quiz');
      setIsSubmitting(false);
    },
  });

  const handleSelectAnswer = (optionIndex: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: optionIndex
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const answers = questions.map((_, index) => selectedAnswers[index] ?? -1);
    
    if (Object.keys(selectedAnswers).length !== questions.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    submitMutation.mutate(answers);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  // Mode consultation des résultats
  if (showResults) {
    const passed = score >= passingScore;

    return (
      <div className="space-y-6">
        {/* Score Summary - Titre fixe */}
        <div className="text-center space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {passed ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Congratulations!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                You passed the quiz with a score of {score}%
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Keep Trying!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your score is {score}%. You need {passingScore}% to pass.
              </p>
            </>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto pr-2">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Answers Review
            </h4>
            
            {questions.map((question, qIndex) => {
              const userAnswerIndex = selectedAnswers[qIndex];
              const correctAnswerIndex = question.correctOption;
              const isCorrect = userAnswerIndex === correctAnswerIndex;

              return (
                <div
                  key={qIndex}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        Question {qIndex + 1}: {question.text}
                      </p>
                      
                      <div className="space-y-2">
                        {question.options?.map((option, oIndex) => {
                          const isUserAnswer = userAnswerIndex === oIndex;
                          const isCorrectAnswer = correctAnswerIndex === oIndex;
                          
                          return (
                            <div
                              key={oIndex}
                              className={`p-3 rounded-lg text-sm ${
                                isCorrectAnswer
                                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                                  : isUserAnswer
                                  ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
                                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`${
                                  isCorrectAnswer
                                    ? 'text-green-900 dark:text-green-100 font-medium'
                                    : isUserAnswer
                                    ? 'text-red-900 dark:text-red-100'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <span className="text-xs text-green-700 dark:text-green-300 font-semibold">
                                    ✓ Correct
                                  </span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="text-xs text-red-700 dark:text-red-300 font-semibold">
                                    Your answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Bouton "Try Again" seulement si pas réussi */}
        {!passed && (
          <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleRetakeQuiz}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Mode passer le quiz
  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No questions available</p>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {currentQuestion.text}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options?.map((option, optionIndex) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;

            return (
              <button
                key={optionIndex}
                onClick={() => handleSelectAnswer(optionIndex)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={`font-medium ${
                    isSelected
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
        Answered: {answeredCount} / {questions.length}
      </div>

      <div className="flex gap-3 justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
        >
          Previous
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!isAllAnswered || isSubmitting}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default StudentQuizComponent;