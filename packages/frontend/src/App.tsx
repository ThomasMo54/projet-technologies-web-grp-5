import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ToastContainer from './components/common/ToastContainer';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from './hooks/useAuth';
import NotFound from './pages/NotFound';
import SignupPage from './pages/SignupPage';

// Configuration de React Query pour la gestion du cache et des requêtes
const queryClient = new QueryClient();

/**
 * Composant de route protégée
 * Vérifie l'authentification et le rôle avant d'autoriser l'accès
 */
const PrivateRoute: React.FC<{ children: React.ReactNode; role: 'teacher' | 'student' }> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  
  // Affiche un loader pendant la vérification de l'authentification
  if (isLoading) {
    return <div>Chargement...</div>; 
  }
  
  // Redirige vers login si non authentifié
  if (!user) return <Navigate to="/login" />;
  
  // Redirige vers le bon dashboard si mauvais rôle
  if (user.type !== role) return <Navigate to={user.type === 'teacher' ? '/teacher/courses' : '/student/courses'} />;
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Redirection de la racine "/" vers "/login" */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Routes protégées pour les professeurs */}
            <Route path="/teacher/*" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
            
            {/* Routes protégées pour les étudiants */}
            <Route path="/student/*" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
            
            {/* Route 404 pour toutes les autres pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        {/* Notifications toast globales */}
        <ToastContainer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;