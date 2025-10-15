import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { fetchCourseStats } from '../../api/stats';
import Loader from '../common/Loader';
import { useParams } from 'react-router-dom';  // Pour courseId si pas passé en props

interface StatsChartProps {
  courseId?: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ courseId: propCourseId }) => {
  const { courseId } = useParams();  // Fallback si pas en props
  const finalCourseId = propCourseId || courseId;

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', finalCourseId],
    queryFn: () => finalCourseId ? fetchCourseStats(finalCourseId) : Promise.resolve([]),
    enabled: !!finalCourseId,
  });

  if (isLoading) return <Loader />;

  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Aucune statistique disponible (pas de réponses aux quizzes).</p>
      </div>
    );
  }

  // Format pour Recharts: { name, progress }
  const chartData = stats.map(stat => ({
    name: stat.name,
    progress: stat.progress,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => [`${value}%`, 'Progression']} />
        <Legend />
        <Bar dataKey="progress" fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.progress > 70 ? '#10b981' : entry.progress > 40 ? '#f59e0b' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;