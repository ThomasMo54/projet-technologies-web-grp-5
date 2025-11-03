import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StudentCourseList from '../components/student/StudentCourseList';
import StudentCourseDetails from '../components/student/StudentCourseDetails';
import NotFound from './NotFound';

/**
 * Dashboard principal pour les étudiants
 * Gère le routing des pages accessibles aux étudiants
 */
const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout role="student">
      <Routes>
        {/* Liste des cours auxquels l'étudiant est inscrit */}
        <Route path="courses" element={<StudentCourseList />} />
        {/* Détails d'un cours spécifique */}
        <Route path="courses/:courseId" element={<StudentCourseDetails />} />
        {/* Page de progression (à implémenter) */}
        <Route path="progress" element={<p>Progress...</p>} />
        {/* Route 404 pour les pages non trouvées */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;