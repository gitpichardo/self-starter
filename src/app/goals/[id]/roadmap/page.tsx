// src/app/goals/[id]/roadmap/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import RoadmapGeneratorForm from '@/components/RoadmapGeneratorForm';

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  roadmap: string | null;
}

const ViewRoadmapPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const goalId = params?.id as string;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [parsedRoadmap, setParsedRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegenerateForm, setShowRegenerateForm] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/goals/${goalId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch goal');
        }
        const data = await response.json();
        setGoal(data);
        if (data.roadmap) {
          try {
            setParsedRoadmap(JSON.parse(data.roadmap));
          } catch (parseError) {
            console.error('Error parsing roadmap:', parseError);
            setError('Error parsing roadmap data');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);

  const handleRegenerateRoadmap = async (timeframe: string, experience: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goal?.title,
          timeframe,
          experience
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate roadmap');
      }

      const newRoadmap = await response.json();

      // Update the goal with the new roadmap
      const updateResponse = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...goal, roadmap: JSON.stringify(newRoadmap) }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update goal with new roadmap');
      }

      const updatedGoal = await updateResponse.json();
      setGoal(updatedGoal);
      setParsedRoadmap(newRoadmap);
      setShowRegenerateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!goal) return <div className="text-center py-8">Goal not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{goal.title}</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">Goal Details</h2>
        <p className="text-gray-700 mb-2"><strong>Description:</strong> {goal.description}</p>
        <p className="text-gray-700 mb-2"><strong>Start Date:</strong> {new Date(goal.startDate).toLocaleDateString()}</p>
        {goal.endDate && (
          <p className="text-gray-700 mb-2"><strong>End Date:</strong> {new Date(goal.endDate).toLocaleDateString()}</p>
        )}
        <p className="text-gray-700 mb-2"><strong>Status:</strong> {goal.status}</p>
      </div>

      {parsedRoadmap ? (
        <>
          <RoadmapDisplay data={parsedRoadmap} />
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowRegenerateForm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Regenerate Roadmap
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-700 mb-4">No roadmap generated yet for this goal.</p>
          <button
            onClick={() => setShowRegenerateForm(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Generate Roadmap
          </button>
        </div>
      )}

      {showRegenerateForm && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Generate New Roadmap</h2>
          <RoadmapGeneratorForm onSubmit={handleRegenerateRoadmap} goalTitle={goal.title} />
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ViewRoadmapPage;