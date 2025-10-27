import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEnrolledCourses, fetchAllCourses } from '../../api/courses';
import Loader from '../common/Loader';
import StudentCourseCard from './StudentCourseCard';
import AvailableCourseCard from './AvailableCourseCard';
import { useAuth } from '../../hooks/useAuth';
import { Search, BookOpen, Package } from 'lucide-react';

const StudentCourseList: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showAvailable, setShowAvailable] = useState(false);

  const { data: enrolledCourses, isLoading: enrolledLoading } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: () => fetchEnrolledCourses(user!.id),
    enabled: !!user,
  });

  const { data: allCourses, isLoading: allCoursesLoading } = useQuery({
    queryKey: ['allCourses'],
    queryFn: () => fetchAllCourses(),
  });

  const isLoading = enrolledLoading || allCoursesLoading;

  if (isLoading) return <Loader />;

  const filteredEnrolledCourses = enrolledCourses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || course.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  }) || [];

  const enrolledCourseIds = new Set(enrolledCourses?.map(c => c.uuid) || []);
  const availableCourses = allCourses?.filter(
      course => !enrolledCourseIds.has(course.uuid) && course.published === true
  ) || [];

  const filteredAvailableCourses = availableCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || course.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set((allCourses || []).flatMap(course => course.tags || []))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {enrolledCourses?.length || 0} course{(enrolledCourses?.length || 0) !== 1 ? 's' : ''} enrolled
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !filterTag
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterTag === tag
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enrolled Courses</h2>
        </div>
        
        {filteredEnrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrolledCourses.map((course) => (
              <StudentCourseCard key={course.uuid} course={course} />
            ))}
          </div>
        ) : (
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl absolute top-0 left-0 right-0"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {enrolledCourses?.length === 0 ? 'No courses enrolled yet' : 'No courses match your search'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <button
          onClick={() => setShowAvailable(!showAvailable)}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Package size={24} />
          {showAvailable ? 'Hide' : 'Show'} Available Courses ({availableCourses.length})
        </button>

        {showAvailable && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Explore More Courses
            </h2>
            
            {filteredAvailableCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableCourses.map((course) => (
                  <AvailableCourseCard key={course.uuid} course={course}  />
                ))}
              </div>
            ) : (
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-t-xl absolute top-0 left-0 right-0"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No available courses match your search
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseList;