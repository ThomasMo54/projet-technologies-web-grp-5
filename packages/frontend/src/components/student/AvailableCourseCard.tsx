import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ICourse } from '../../interfaces/course';
import { Plus, BookMarked, Tag, User } from 'lucide-react';
import { enrollCourse } from '../../api/courses';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface AvailableCourseCardProps {
  course: ICourse;
}

const AvailableCourseCard: React.FC<AvailableCourseCardProps> = ({ course }) => {
  const courseId = course.uuid;
  const [isEnrolling, setIsEnrolling] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();


  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(courseId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['allCourses'] });
      toast.success('Successfully enrolled in course');
    },
    onError: () => {
      toast.error('Failed to enroll in course');
    },
  });

  const handleEnroll = () => {
    setIsEnrolling(true);
    enrollMutation.mutate();
    setTimeout(() => setIsEnrolling(false), 1000);
  };
  
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full"
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
            <BookMarked size={16} className="text-purple-500" />
            <span className="font-medium">{course.chapters?.length || 0}</span>
            <span className="hidden sm:inline">chapters</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User size={16} className="text-pink-500" />
            <span className="font-medium">{course.students?.length || 0}</span>
            <span className="hidden sm:inline">students</span>
          </div>
        </div>

        <button
          onClick={handleEnroll}
          disabled={isEnrolling}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnrolling ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Plus size={16} />
              Enroll Now
            </>
          )}
        </button>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500 dark:group-hover:border-purple-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default AvailableCourseCard;