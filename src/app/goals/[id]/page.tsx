'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RoadmapDisplay from '@/components/RoadmapDisplay';

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  roadmap: string | null;
}

const GoalDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const goalId = params?.id as string;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockDatabase, setIsMockDatabase] = useState<boolean>(false);

  const fetchGoal = useCallback(async () => {
    if (!goalId) {
      setError('Goal ID is missing');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/goals/${goalId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Goal not found');
        } else {
          throw new Error('Failed to fetch goal');
        }
      } else {
        const data = await response.json();
        setGoal(data.goal);
        setIsMockDatabase(data.isMockDatabase);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  if (isLoading) return <div className="text-center py-8">Loading goal details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!goal) return <div className="text-center py-8">Goal not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {isMockDatabase && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Note:</p>
          <p>You are viewing data from a mock database for demonstration purposes.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">{goal.title}</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-indigo-600">
          <h2 className="text-2xl font-bold text-white">Goal Details</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4"><strong>Description:</strong> {goal.description}</p>
          <p className="text-gray-700 mb-4"><strong>Start Date:</strong> {new Date(goal.startDate).toLocaleDateString()}</p>
          {goal.endDate && (
            <p className="text-gray-700 mb-4"><strong>End Date:</strong> {new Date(goal.endDate).toLocaleDateString()}</p>
          )}
          <p className="text-gray-700 mb-4"><strong>Status:</strong> {goal.status}</p>
        </div>
      </div>

      {goal.roadmap ? (
        <RoadmapDisplay data={goal.roadmap} />
      ) : (
        <div className="text-center py-4 bg-gray-100 rounded-lg mb-8">
          <p>No roadmap available for this goal.</p>
        </div>
      )}

      <div className="mt-8 text-center space-x-4">
        <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Back to Dashboard
        </Link>
        <button
          onClick={() => router.push(`/goals/${goalId}/edit`)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Edit Goal
        </button>
      </div>
    </div>
  );
};

export default GoalDetailsPage;