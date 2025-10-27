import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizByChapter, fetchUserQuizAnswer } from '../../api/quizzes';
import type { IChapter } from '../../interfaces/chapter';
import { BookOpen, CheckCircle, Trophy, Award, Sparkles } from 'lucide-react';
import StudentChapterContent from './StudentChapterContent';
import Modal from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';

interface StudentChapterListProps {
  chapters: IChapter[];
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
}

const StudentChapterList: React.FC<StudentChapterListProps> = ({ 
  chapters, 
  selectedChapterId, 
  onSelectChapter 
}) => {
  const { user } = useAuth();
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);

  const quizzes = chapters.map(chapter => ({
    chapterId: chapter.uuid,
    ...useQuery({
      queryKey: ['quiz', chapter.uuid],
      queryFn: () => fetchQuizByChapter(chapter.uuid),
    }),
  }));

  const userAnswers = chapters.map(chapter => ({
    chapterId: chapter.uuid,
    ...useQuery({
      queryKey: ['userQuizAnswer', chapter.uuid, user?.id],
      queryFn: async () => {
        const quiz = await fetchQuizByChapter(chapter.uuid);
        if (!quiz || !user?.id) return null;
        return fetchUserQuizAnswer(quiz.uuid, user.id);
      },
      enabled: !!user?.id,
    }),
  }));

  const getChapterStatus = (chapterId: string) => {
    const quizData = quizzes.find(q => q.chapterId === chapterId);
    const userAnswerData = userAnswers.find(a => a.chapterId === chapterId);

    const hasQuiz = quizData?.data !== null;
    const userAnswer = userAnswerData?.data;
    const quizPassed = userAnswer && userAnswer.score >= 70;

    return {
      completed: hasQuiz ? quizPassed : true,
      hasQuiz,
      quizPassed,
      score: userAnswer?.score,
    };
  };

  const handleViewSummary = (summary: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSummary(summary);
    setSummaryModalOpen(true);
  };

  // Function to strip HTML tags and get plain text
  const getPlainText = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          No chapters available yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const status = getChapterStatus(chapter.uuid);
          const isSelected = selectedChapterId === chapter.uuid;
          const isExpanded = expandedChapterId === chapter.uuid;

          return (
            <div key={chapter.uuid}>
              <button
                onClick={() => {
                  onSelectChapter(chapter.uuid);
                  setExpandedChapterId(isExpanded ? null : chapter.uuid);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                } hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {status.completed ? (
                      <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className={`text-lg font-semibold ${
                        isSelected 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {chapter.title}
                      </h4>
                      {chapter.summary && (
                        <button
                          onClick={(e) => handleViewSummary(chapter.summary!, e)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full hover:shadow-md transition-all duration-200 border border-purple-200 dark:border-purple-700"
                          title="View AI Summary"
                        >
                          <Sparkles size={12} />
                          AI Summary
                        </button>
                      )}
                      {status.completed && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          <Trophy size={12} />
                          Completed
                        </span>
                      )}
                      {status.score !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                          <Award size={12} />
                          Score: {status.score}%
                        </span>
                      )}
                    </div>
                    {chapter.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {getPlainText(chapter.content).substring(0, 150)}...
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      } text-gray-400`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <StudentChapterContent 
                    chapter={chapter}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={summaryModalOpen}
        onClose={() => {
          setSummaryModalOpen(false);
          setSelectedSummary(null);
        }}
        title="AI-Generated Summary"
        width="3xl"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              This summary was automatically generated by AI
            </span>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedSummary || 'No summary available for this chapter.'}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StudentChapterList;