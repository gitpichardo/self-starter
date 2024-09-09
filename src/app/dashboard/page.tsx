'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoalInputForm from '@/components/GoalInputForm';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  roadmap: string | null;
}

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockDatabase, setIsMockDatabase] = useState<boolean | null>(null);

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals);
        setIsMockDatabase(data.isMockDatabase);
      } else {
        throw new Error('Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to load goals. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchGoals();
    }
  }, [status, router, fetchGoals]);

  const handleGoalCreated = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {session?.user?.name || 'User'}!</p>
      {isMockDatabase && (
        <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          Note: You are currently using a mock database for demonstration purposes.
        </p>
      )}
      <GoalInputForm onGoalCreated={handleGoalCreated} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : goals.length === 0 ? (
          <p>You haven&apos;t set any goals yet.</p>
        ) : (
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold">{goal.title}</h3>
                <p className="text-gray-600">{goal.description}</p>
                <p className="text-sm text-gray-500">Status: {goal.status}</p>
                <div className="mt-2">
                  <Link href={`/goals/${goal.id}/roadmap`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                    View Roadmap
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;