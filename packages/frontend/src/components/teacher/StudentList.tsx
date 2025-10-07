import React from 'react';
import type { IStudent } from '../../interfaces/student';
import { Users, User } from 'lucide-react';

interface StudentListProps {
  students: IStudent[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-blue-500 dark:text-blue-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Enrolled Students</h3>
          </div>

          {/* Student List */}
          {students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <User className="text-purple-500 dark:text-purple-400" size={20} />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {student.firstname} {student.lastname}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No students enrolled yet.</p>
            </div>
          )}
        </div>
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default StudentList;