import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById, fetchEnrolledStudent } from '../../api/courses';
import { fetchComments } from '../../api/comments';
import { fetchChaptersByCourse } from '../../api/chapters';
import Loader from '../common/Loader';
import StudentList from './StudentList';
import CommentList from './CommentList';
import ChapterList from './ChapterList';
import StatsChart from './StatsChart';
import Modal from '../common/Modal';
import ChapterForm from '../forms/ChapterForm';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import { PlusCircle } from 'lucide-react';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId!),
  });
  const { data: students } = useQuery({
    queryKey: ['students', course?.students],
    queryFn: () =>
      course?.students
        ? Promise.all(course.students.map(id => fetchEnrolledStudent(id)))
        : Promise.resolve([]),
  });
  const { data: comments } = useQuery({
    queryKey: ['comments', courseId],
    queryFn: () => fetchComments(courseId!),
  });
  const { data: chapters, refetch } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: () => fetchChaptersByCourse(courseId!),
  });
  const [addChapterModalOpen, setAddChapterModalOpen] = useState(false);

  const handleAddChapter = () => setAddChapterModalOpen(true);
  const handleClose = () => setAddChapterModalOpen(false);
  const handleSuccess = () => {
    refetch();
    handleClose();
    toast.success('Chapter added!');

  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Course Info Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{course?.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{course?.description || 'No description available'}</p>
          {course?.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Chapters Section */}
      <section className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Chapters</h3>
            <Button
              onClick={handleAddChapter}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg"
            >
              <PlusCircle size={20} />
              Add Chapter
            </Button>
          </div>
          <ChapterList chapters={chapters || []} courseId={courseId!} />
        </div>
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </section>

       {/* Enrolled Students Section */}
      <section className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enrolled Students</h3>
          <StudentList students={students || []} />
        </div>
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </section>


      {/* Comments Section */}
      <section className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h3>
          <CommentList comments={comments || []} courseId={courseId!} />
        </div>
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </section>

      {/* Statistics Section */}
      <section className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
          <StatsChart courseId={courseId!} />
        </div>
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </section>

      <Modal isOpen={addChapterModalOpen} onClose={handleClose} title="Add Chapter">
        <ChapterForm courseId={courseId!} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default CourseDetails;