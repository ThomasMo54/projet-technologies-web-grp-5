import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTeacherCourses, deleteCourse } from '../../api/courses';
import Loader from '../common/Loader';
import CourseCard from './CourseCard';
import Modal from '../common/Modal';
import CourseForm from '../forms/CourseForm';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import type { ICourse } from '../../interfaces/course';
import { PlusCircle } from 'lucide-react';

/**
 * Tableau de bord des cours de l'enseignant
 * Fonctionnalités :
 * - Liste des cours créés
 * - Création, édition, suppression
 * - Rafraîchissement après actions
 */
const CourseList: React.FC = () => {
  const { user } = useAuth();
  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ['teacherCourses', user?.id],
    queryFn: () => fetchTeacherCourses(user!.id),
    enabled: !!user,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const handleEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setEditModalOpen(true);
  };

  const handleCreate = () => setCreateModalOpen(true);

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      refetch();
      toast.success('Course deleted!');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleClose = () => {
    setEditModalOpen(false);
    setCreateModalOpen(false);
    setSelectedCourse(null);
  };

  const handleSuccess = () => {
    refetch();
    handleClose();
    toast.success(selectedCourse ? 'Course updated!' : 'Course created!');
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Courses</h1>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg"
        >
          <PlusCircle size={20} />
          Create Course
        </Button>
      </div>
      
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.uuid}
              course={course}
              onEdit={() => handleEdit(course)}
              onDelete={() => handleDelete(course.uuid)}
              onPublishedChange={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl absolute top-0 left-0 right-0"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">No courses yet. Create your first course!</p>
          <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
        </div>
      )}
      
      <Modal isOpen={editModalOpen} onClose={handleClose} title="Edit Course" width="4xl">
        {selectedCourse && <CourseForm course={selectedCourse} onSuccess={handleSuccess} />}
      </Modal>
      <Modal isOpen={createModalOpen} onClose={handleClose} title="Create Course" width="4xl">
        <CourseForm onSuccess={handleSuccess} creatorId={user!.id} />
      </Modal>
    </div>
  );
};

export default CourseList;