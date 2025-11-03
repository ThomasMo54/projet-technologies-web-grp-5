import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import CourseList from '../components/teacher/CourseList';
import CourseDetails from '../components/teacher/CourseDetails';
import NotFound from './NotFound';

/**
 * Dashboard principal pour les professeurs
 * Gère le routing des pages accessibles aux professeurs
 */
const TeacherDashboard: React.FC = () => {
  return (
    <Routes>
      {/* Liste des cours créés par le professeur */}
      <Route path="courses" element={<DashboardLayout role="teacher"><CourseList /></DashboardLayout>} />
      {/* Détails et gestion d'un cours */}
      <Route path="courses/:courseId" element={<DashboardLayout role="teacher"><CourseDetails /></DashboardLayout>} />
      {/* Statistiques globales des cours */}
      <Route path="stats" element={<DashboardLayout role="teacher"><p>Progress...</p></DashboardLayout>} />
      {/* Route 404 pour les pages non trouvées */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TeacherDashboard;