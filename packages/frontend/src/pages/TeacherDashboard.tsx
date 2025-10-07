import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import CourseList from '../components/teacher/CourseList';
import CourseDetails from '../components/teacher/CourseDetails';
import StatsChart from '../components/teacher/StatsChart';

const TeacherDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="courses" element={<DashboardLayout role="teacher"><CourseList /></DashboardLayout>} />
      <Route path="courses/:courseId" element={<DashboardLayout role="teacher"><CourseDetails /></DashboardLayout>} />
      <Route path="stats" element={<DashboardLayout role="teacher"><StatsChart /></DashboardLayout>} />
    </Routes>
  );
};

export default TeacherDashboard;