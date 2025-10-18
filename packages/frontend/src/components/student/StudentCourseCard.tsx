import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ICourse } from '../../interfaces/course';
import { Eye, BookMarked, Tag, User, LogOut } from 'lucide-react';
import { unenrollCourse } from '../../api/courses';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface StudentCourseCardProps {
  course: ICourse;
}

const StudentCourseCard: React.FC<StudentCourseCardProps> = ({ course }) => {
  const courseId = course.uuid;
  const [isUnrolling, setIsUnrolling] = useState(false);
  const queryClient = useQueryClient();
  const progressPercentage = 45;
  const { user } = useAuth();


  const unenrollMutation = useMutation({
    mutationFn: () => unenrollCourse(courseId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['allCourses'] });
      toast.success('Successfully unenrolled from course');
    },
    onError: () => {
      toast.error('Failed to unenroll from course');
    },
  });

  const handleUnenroll = () => {
    const confirmed = window.confirm('Are you sure you want to unenroll from this course?');
    if (confirmed) {
      setIsUnrolling(true);
      unenrollMutation.mutate();
      setTimeout(() => setIsUnrolling(false), 1000);
    }
  };
  
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.description || 'No description available'}
        </p>

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookMarked size={16} className="text-blue-500" />
            <span className="font-medium">{course.chapters?.length || 0}</span>
            <span className="hidden sm:inline">chapters</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User size={16} className="text-purple-500" />
            <span className="font-medium">{course.students?.length || 0}</span>
            <span className="hidden sm:inline">students</span>
          </div>
        </div>

        <div className="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/student/courses/${courseId}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Eye size={16} />
            Continue Learning
          </Link>
          <button
            onClick={handleUnenroll}
            disabled={isUnrolling}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Unenroll from this course"
          >
            {isUnrolling ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogOut size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default StudentCourseCard;