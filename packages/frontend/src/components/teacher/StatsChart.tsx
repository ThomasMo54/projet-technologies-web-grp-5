import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchCourseStats } from '../../api/stats';
import Loader from '../common/Loader';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

interface StatsChartProps {
  courseId?: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ courseId }) => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', courseId, user?.id],
    queryFn: () => courseId ? fetchCourseStats(courseId) : fetchAllStats(user!.id),
    enabled: !!user,
  });

  // Mock data fallback since stats endpoint not provided
  const mockStats = [
    { name: 'Student 1', progress: 80 },
    { name: 'Student 2', progress: 60 },
    { name: 'Student 3', progress: 90 },
  ];

  if (isLoading) return <Loader />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats || mockStats}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="progress" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;

// Example implementation for fetchAllStats
async function fetchAllStats(id: string): Promise<Array<{ name: string; progress: number }>> {
    const response = await axios.get(`/api/stats/all?teacherId=${id}`);
    // Assuming the API returns: [{ name: string, progress: number }, ...]
    return response.data;
}


