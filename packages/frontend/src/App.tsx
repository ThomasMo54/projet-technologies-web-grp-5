import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ToastContainer from './components/common/ToastContainer';
import TeacherDashboard from './pages/TeacherDashboard';
import { useAuth } from './hooks/useAuth';
import NotFound from './pages/NotFound';




const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode; role: 'teacher' | 'student' }> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>; 
  }
  
  if (!user) return <Navigate to="/login" />;
  if (user.type !== role) return <Navigate to={user.type === 'teacher' ? '/teacher/courses' : '/student/courses'} />;
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/teacher/*" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
        <ToastContainer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;