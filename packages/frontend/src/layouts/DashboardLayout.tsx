import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import UserProfileSettings from '../components/common/UserProfileSettings';
import { updateUser, deleteUser, verifyCurrentPassword } from '../api/user';
import { Menu, X, BookOpen, BarChart3, User, LogOut, GraduationCap, TrendingUp } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'teacher' | 'student';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { user, logout, updateAuthUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Navigation différente selon le rôle (professeur ou étudiant)
  const navItems = role === 'teacher' ? [
    { path: '/teacher/courses', label: 'My Courses', icon: BookOpen },
    { path: '/teacher/stats', label: 'Statistics', icon: BarChart3 },
  ] : [
    { path: '/student/courses', label: 'Enrolled Courses', icon: GraduationCap },
    { path: '/student/progress', label: 'My Progress', icon: TrendingUp },
  ];

  const isActive = (path: string) => location.pathname === path;

  /**
   * Gère la mise à jour du profil utilisateur
   * Vérifie le mot de passe actuel si un changement de mot de passe est demandé
   */
  const handleUpdateUser = async (updates: {
    firstname: string;
    lastname: string;
    password?: string;
    currentPassword?: string;
  }) => {
    if (!user) throw new Error('User not found');

    // Vérification du mot de passe actuel si changement demandé
    if (updates.password && updates.currentPassword) {
      const isPasswordValid = await verifyCurrentPassword(user.email, updates.currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
    }

    const dataToUpdate: any = {
      firstname: updates.firstname,
      lastname: updates.lastname,
    };

    if (updates.password) {
      dataToUpdate.password = updates.password;
    }

    const updatedUser = await updateUser(user.id, dataToUpdate);
    
    // Mise à jour du contexte d'authentification
    updateAuthUser({
      ...user,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
    });
  };

  /**
   * Supprime le compte utilisateur après vérification du mot de passe
   */
  const handleDeleteUser = async (password: string) => {
    if (!user) throw new Error('User not found');
    
    const isPasswordValid = await verifyCurrentPassword(user.email, password);
    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }

    await deleteUser(user.id);
    
    setProfileModalOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Bouton menu mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay pour fermer la sidebar en cliquant à l'extérieur */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 bg-white dark:bg-gray-800 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo & Titre */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {role === 'teacher' ? 'Teacher' : 'Student'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${active
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profil utilisateur cliquable */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="w-full flex items-center space-x-3 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </button>
          <Button
            onClick={logout}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Modal de paramètres du profil */}
      {user && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title="Profile Settings"
          width="2xl"
        >
          <UserProfileSettings
            user={user}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        </Modal>
      )}
    </div>
  );
};

export default DashboardLayout;