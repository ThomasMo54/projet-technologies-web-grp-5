import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StudentCourseList from '../components/student/StudentCourseList';
import StudentCourseDetails from '../components/student/StudentCourseDetails';
import NotFound from './NotFound';

const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout role="student">
      <Routes>
        <Route path="courses" element={<StudentCourseList />} />
        <Route path="courses/:courseId" element={<StudentCourseDetails />} />
        <Route path="progress" element={ <p> Progress...</p>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;