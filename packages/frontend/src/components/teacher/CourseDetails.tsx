import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById, fetchEnrolledStudent } from '../../api/courses';
import { fetchComments } from '../../api/comments';
import { fetchChaptersByCourse } from '../../api/chapters';
import Loader from '../common/Loader';
import StudentList from './StudentList';
import CommentList from '../common/CommentList';
import ChapterList from './ChapterList';
import Modal from '../common/Modal';
import ChapterForm from '../forms/ChapterForm';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  MessageCircle, 
  BarChart3,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import StudentStatsTable from './StudentStatsTable';

/**
 * Page de détail du cours pour l'enseignant
 * Affiche :
 * - Infos cours, stats, chapitres, étudiants, commentaires, stats
 * - Ajout de chapitre via modal
 * - Rafraîchissement des données après ajout
 */
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
    toast.success('Chapitre ajouté avec succès!');
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        
        {/* === Section principale du cours === */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
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
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        Créé le {new Date(Date.now()).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {course?.description || 'Aucune description disponible pour ce cours.'}
                </p>

                {course?.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* === Cartes statistiques === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen size={24} />
                  <TrendingUp size={20} className="opacity-70" />
                </div>
                <div className="text-3xl font-bold mb-1">{chapters?.length || 0}</div>
                <div className="text-blue-100 text-sm font-medium">Chapitres</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Users size={24} />
                  <Award size={20} className="opacity-70" />
                </div>
                <div className="text-3xl font-bold mb-1">{students?.length || 0}</div>
                <div className="text-purple-100 text-sm font-medium">Étudiants inscrits</div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <MessageCircle size={24} />
                  <BarChart3 size={20} className="opacity-70" />
                </div>
                <div className="text-3xl font-bold mb-1">{comments?.length || 0}</div>
                <div className="text-pink-100 text-sm font-medium">Commentaires</div>
              </div>
            </div>
          </div>
        </div>

        {/* === Chapitres === */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Chapitres</h3>
              </div>
              <Button
                onClick={handleAddChapter}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2.5 px-5 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <PlusCircle size={20} />
                Ajouter un chapitre
              </Button>
            </div>
            <ChapterList chapters={chapters || []} courseId={courseId!} />
          </div>
        </section>

        {/* === Étudiants, Commentaires, Stats === */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Étudiants inscrits</h3>
            </div>
            <StudentList students={students || []} />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <MessageCircle size={24} className="text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Commentaires</h3>
            </div>
            <CommentList comments={comments || []} courseId={courseId!} />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BarChart3 size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Performances des étudiants</h3>
            </div>
                 <StudentStatsTable courseId={courseId!} />          
            </div>
        </section>
      </div>

      {/* === Modal ajout chapitre === */}
      <Modal isOpen={addChapterModalOpen} onClose={handleClose} title="Ajouter un chapitre" width="5xl">
        <ChapterForm courseId={courseId!} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default CourseDetails;