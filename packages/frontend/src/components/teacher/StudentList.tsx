import React from 'react';
import type { IStudent } from '../../interfaces/student';
import { Users, User } from 'lucide-react';

interface StudentListProps {
  students: IStudent[]; // Liste des étudiants inscrits
}

/**
 * Liste des étudiants inscrits au cours (enseignant)
 * Fonctionnalités :
 * - Affichage nom, prénom, email
 * - Icônes utilisateur et groupe
 * - Effet de survol sur chaque étudiant
 * - Message si aucun étudiant
 * - Design cohérent avec le reste du dashboard
 */
const StudentList: React.FC<StudentListProps> = ({ students }) => {
  // === DEBUG : Vérifiez la structure des données dans la console ===
  console.log('Students data:', students);

  return (
    <div className="max-w-7xl mx-auto">
      {/* === Conteneur principal === */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        {/* === Bandeau décoratif === */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          {/* === En-tête === */}
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-blue-500 dark:text-blue-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Enrolled Students</h3>
          </div>

          {/* === Liste des étudiants === */}
          {students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student, index) => (
                <div
                  key={student.id || index}  // Priorité à id ; fallback index si absent (à éviter en prod)
                  className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
                >
                  {/* === Infos étudiant === */}
                  <div className="flex items-center gap-3">
                    <User className="text-purple-500 dark:text-purple-400" size={20} />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {student.firstname} {student.lastname}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  {/* Effet de bordure au survol */}
                  <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            /* === État vide === */
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No students enrolled yet.</p>
            </div>
          )}
        </div>
        {/* Effet de bordure sur tout le conteneur */}
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default StudentList;