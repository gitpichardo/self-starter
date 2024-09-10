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

export default function DashboardPage() {
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log('Fetched goals:', data);
      setGoals(data.goals);
      setIsMockDatabase(data.isMockDatabase);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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
//check if the user is in demo mode

const handleGoalCreated = useCallback(async (goalData: any) => {
  try {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }
    await fetchGoals();
  } catch (error) {
    console.error('Error creating goal:', error);
    setError(error instanceof Error ? error.message : 'An unexpected error occurred while creating the goal');
  }
}, [fetchGoals]);
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {session && <p className="mb-4">Welcome, {session.user?.name || 'User'}!</p>}
      
      {isMockDatabase && (
        <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          Note: You are currently using a mock database for demonstration purposes.
        </p>
      )}
      
      <GoalInputForm onGoalCreated={handleGoalCreated} />
      
      <h2 className="text-xl font-semibold mb-2 mt-8">Your Goals</h2>
      {isLoading ? (
        <LoadingSpinner />
      ) : goals.length === 0 ? (
        <p>No goals found. Start by creating a new goal!</p>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li key={goal.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">{goal.title}</h3>
              <p className="text-gray-600">{goal.description}</p>
              <p className="text-sm">Status: {goal.status}</p>
              <div className="mt-2 space-x-4">
                <Link href={`/goals/${goal.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
                <Link href={`/goals/${goal.id}/roadmap`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View Roadmap
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-8">
        <Link href="/goals/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Goal
        </Link>
      </div>
    </div>
  );
}