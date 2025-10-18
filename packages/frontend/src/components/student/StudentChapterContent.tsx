import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchQuizByChapter, fetchUserQuizAnswer } from '../../api/quizzes';
import type { IChapter } from '../../interfaces/chapter';
import { FileText, Loader, BookOpen, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import StudentQuizComponent from './StudentQuizComponent';
import { useAuth } from '../../hooks/useAuth';

interface StudentChapterContentProps {
  chapter: IChapter;
}

const StudentChapterContent: React.FC<StudentChapterContentProps> = ({ chapter }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', chapter.uuid],
    queryFn: () => fetchQuizByChapter(chapter.uuid),
  });

  const { data: userAnswer, refetch: refetchUserAnswer } = useQuery({
    queryKey: ['userQuizAnswer', quiz?.uuid, user?.id],
    queryFn: () => {
      if (!quiz || !user?.id) return null;
      return fetchUserQuizAnswer(quiz.uuid, user.id);
    },
    enabled: !!quiz && !!user?.id,
  });

  const passingScore = 70;
  const quizPassed = userAnswer && userAnswer.score >= passingScore;

  const handleQuizComplete = async (score: number) => {
    if (score >= passingScore) {
      // Rafraîchir les données du quiz
      await refetchUserAnswer();
      queryClient.invalidateQueries({ queryKey: ['userQuizAnswer', quiz?.uuid, user?.id] });
      
      // Fermer le modal
      setQuizModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {chapter.content && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            <h5 className="font-semibold text-gray-900 dark:text-white">Chapter Content</h5>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {chapter.content}
            </p>
          </div>
        </div>
      )}

      {quizLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-blue-500" size={24} />
        </div>
      ) : quiz ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-purple-600 dark:text-purple-400" />
            <h5 className="font-semibold text-gray-900 dark:text-white">Chapter Quiz</h5>
          </div>
          
          {quizPassed ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Quiz Completed ✓
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Score: {userAnswer.score}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Test your knowledge with a quiz
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    You must score at least {passingScore}% to pass
                  </p>
                </div>
                <Button
                  onClick={() => setQuizModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
                >
                  Start
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                Chapter Complete
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                No quiz required for this chapter
              </p>
            </div>
          </div>
        </div>
      )}

      <Modal 
        isOpen={quizModalOpen} 
        onClose={() => setQuizModalOpen(false)} 
        title={quiz?.title || "Chapter Quiz"}
        width="4xl"
      >
        {quiz && <StudentQuizComponent quiz={quiz} onComplete={handleQuizComplete} />}
      </Modal>
    </div>
  );
};

export default StudentChapterContent;