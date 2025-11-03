// src/components/teacher/StudentStatsTable.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseStats } from '../../api/stats';
import Loader from '../common/Loader';
import { CheckCircle, XCircle, Minus } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface StudentStat {
  name: string;
  studentId: string;
  progress: number;
  completedQuizzes: number;
  totalQuizzes: number;
  quizScores: { [quizName: string]: number }; // score par quiz
}

interface StudentStatsTableProps {
  courseId?: string;
}

/**
 * Tableau détaillé des performances des étudiants
 * - Score par quiz
 * - Moyenne globale
 * - Quizzes passés / restants
 */
const StudentStatsTable: React.FC<StudentStatsTableProps> = ({ courseId: propCourseId }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const finalCourseId = propCourseId || courseId;

  const { data: stats = [], isLoading, error } = useQuery<StudentStat[]>({
    queryKey: ['courseStats', finalCourseId],
    queryFn: () => fetchCourseStats(finalCourseId!),
    enabled: !!finalCourseId,
  });

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Erreur de chargement</p>;

  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-600 dark:text-gray-400">
          Aucun étudiant n'a encore passé de quiz
        </p>
      </div>
    );
  }

  // Extraire tous les noms de quizzes
  const allQuizNames = Array.from(
    new Set(stats.flatMap(s => Object.keys(s.quizScores)))
  ).sort();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Étudiant</th>
              {allQuizNames.map(name => (
                <th key={name} className="px-4 py-3 text-center font-semibold">
                  {name.length > 12 ? name.substring(0, 10) + '...' : name}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold">Moyenne</th>
              <th className="px-4 py-3 text-center font-semibold">Passés</th>
              <th className="px-4 py-3 text-center font-semibold">Restants</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.map((student) => {
              const passed = student.completedQuizzes;
              const remaining = student.totalQuizzes - passed;
              const avg = student.progress;

              return (
                <tr
                  key={student.studentId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </td>
                  {allQuizNames.map(quizName => {
                    const score = student.quizScores[quizName];
                    return (
                      <td key={quizName} className="px-4 py-3 text-center">
                        {score !== undefined ? (
                          <div className="flex items-center justify-center gap-1">
                            {score >= 70 ? (
                              <CheckCircle size={16} className="text-green-600" />
                            ) : (
                              <XCircle size={16} className="text-red-600" />
                            )}
                            <span className={`font-medium ${score >= 70 ? 'text-green-700' : 'text-red-700'}`}>
                              {score}%
                            </span>
                          </div>
                        ) : (
                          <Minus size={16} className="text-gray-400 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        avg/100 >= 70
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : avg/100 >= 40
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {avg/100}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    {passed}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    {remaining}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-600" />
            <span>≥ 70% (Réussi)</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-600" />
            <span>&lt; 70% (Échoué)</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus size={14} className="text-gray-400" />
            <span>Non passé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStatsTable;