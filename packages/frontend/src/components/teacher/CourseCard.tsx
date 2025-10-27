import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ICourse } from '../../interfaces/course';
import { Eye, Edit, Trash2, Users, BookMarked, Tag, CheckCircle } from 'lucide-react';
import { updateCourse } from '../../api/courses';
import { toast } from 'react-toastify';

interface CourseCardProps {
  course: ICourse;
  onEdit: () => void;
  onDelete: () => void;
  onPublishedChange?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, onPublishedChange }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await updateCourse(course.uuid, { published: true });
      toast.success('Course published!');
      if (onPublishedChange) onPublishedChange();
    } catch (error) {
      toast.error('Failed to publish course');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.description || 'No description available'}
        </p>

        {/* Tags */}
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

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users size={16} className="text-purple-500" />
            <span className="font-medium">{course.students?.length || 0}</span>
            <span className="hidden sm:inline">students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookMarked size={16} className="text-blue-500" />
            <span className="font-medium">{course.chapters?.length || 0}</span>
            <span className="hidden sm:inline">chapters</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <Link
            to={`/teacher/courses/${course.uuid}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Eye size={16} />
            View
          </Link>

          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            aria-label="Edit course"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors"
            aria-label="Delete course"
          >
            <Trash2 size={16} />
          </button>

          {!course.published && (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 font-medium rounded-lg transition-colors"
              aria-label="Publish course"
            >
              <CheckCircle size={16} />
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default CourseCard;
