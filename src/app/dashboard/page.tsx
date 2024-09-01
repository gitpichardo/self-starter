'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoalInputForm from '@/components/GoalInputForm';

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchGoals();
    }
  }, [status, router]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else {
        console.error('Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleGoalCreated = () => {
    fetchGoals();
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {session?.user?.name || 'User'}!</p>
      <GoalInputForm onGoalCreated={handleGoalCreated} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
        {goals.length === 0 ? (
          <p>You haven&apos;t set any goals yet.</p>
        ) : (
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal.id} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{goal.title}</h3>
                <p>{goal.description}</p>
                <p>Status: {goal.status}</p>
                <div className="mt-2">
                  <Link href={`/goals/${goal.id}/roadmap`} className="text-indigo-600 hover:text-indigo-800">
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