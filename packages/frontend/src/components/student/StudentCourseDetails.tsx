import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchCourseById, fetchEnrolledStudent } from '../../api/courses';
import { fetchComments } from '../../api/comments';
import { fetchChaptersByCourse } from '../../api/chapters';
import { fetchQuizByChapter, fetchUserQuizAnswer } from '../../api/quizzes';
import Loader from '../common/Loader';
import CommentList from '../common/CommentList';
import StudentChapterList from './StudentChapterList';
import CourseChatbot from './CourseChatbot';
import { BookOpen, MessageCircle, ArrowLeft, Calendar, User, Tag, CheckCircle, Bot } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const StudentCourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId!),
  });

  const { data: teacher } = useQuery({
    queryKey: ['teacher', course?.creatorId],
    queryFn: () => fetchEnrolledStudent(course!.creatorId),
    enabled: !!course?.creatorId,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', courseId],
    queryFn: () => fetchComments(courseId!),
  });

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: () => fetchChaptersByCourse(courseId!),
  });

  const quizzesQueries = useQueries({
    queries: (chapters || []).map(chapter => ({
      queryKey: ['quiz', chapter.uuid],
      queryFn: () => fetchQuizByChapter(chapter.uuid),
      enabled: !!chapter.uuid,
    })),
  });

  const userAnswersQueries = useQueries({
    queries: (chapters || []).map((_, index) => {
      const quiz = quizzesQueries[index]?.data;
      return {
        queryKey: ['userQuizAnswer', quiz?.uuid, user?.id],
        queryFn: async () => {
          if (!quiz || !user?.id) return null;
          return fetchUserQuizAnswer(quiz.uuid, user.id);
        },
        enabled: !!quiz && !!user?.id,
      };
    }),
  });

  const calculateProgress = () => {
    if (!chapters || chapters.length === 0) return 0;

    let quizzesCompleted = 0;
    let totalQuizzes = 0;

    chapters.forEach((_, index) => {
      const quiz = quizzesQueries[index]?.data;
      const userAnswer = userAnswersQueries[index]?.data;

      if (quiz) {
        totalQuizzes++;
        if (userAnswer && userAnswer.score >= 70) {
          quizzesCompleted++;
        }
      } else {
        totalQuizzes++;
        quizzesCompleted++;
      }
    });

    return totalQuizzes > 0 ? Math.round((quizzesCompleted / totalQuizzes) * 100) : 0;
  };

  if (courseLoading || chaptersLoading) return <Loader />;

  const progressPercentage = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        
        <button
          onClick={() => navigate('/student/courses')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>

        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="relative p-8 md:p-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {course?.title}
                    </h1>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <User size={16} />
                        {teacher?.firstname} {teacher?.lastname}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar size={16} />
                        Created {new Date(Date.now()).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {course?.description || 'No description available for this course.'}
                </p>

                {course?.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
                      >
                        <Tag size={14} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Your Progress</h3>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {progressPercentage === 100 ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle size={14} />
                    Course completed!
                  </span>
                ) : (
                  `Keep going! You're ${progressPercentage}% through this course.`
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{chapters?.length || 0}</div>
                <div className="text-blue-100 text-sm font-medium">Chapters to Learn</div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <MessageCircle size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{comments?.length || 0}</div>
                <div className="text-pink-100 text-sm font-medium">Course Comments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton flottant pour le chatbot */}
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-full p-4 shadow-2xl transition-all duration-300 group-hover:scale-110">
              <Bot size={28} className="text-white" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg animate-bounce">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>

        {/* Modal du chatbot */}
        {showChat && (
          <CourseChatbot courseId={courseId!} onClose={() => setShowChat(false)} />
        )}

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Course Content</h3>
            </div>
            <StudentChapterList 
              chapters={chapters || []} 
              selectedChapterId={selectedChapterId}
              onSelectChapter={setSelectedChapterId}
            />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <MessageCircle size={24} className="text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Course Discussion</h3>
            </div>
            <CommentList comments={comments || []} courseId={courseId!} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentCourseDetails;