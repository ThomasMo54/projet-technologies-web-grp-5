import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import NotFound from './NotFound';

const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout role="student">
      <Routes>
        <Route path="courses/" element={<div>Courses Liste...</div>} />
        <Route path="courses/:courseId" element={<div>Course Details...</div>} />
        <Route path="progress" element={<div>Progress...</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;