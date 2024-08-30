'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RoadmapGeneratorForm from '@/components/RoadmapGeneratorForm';
import RoadmapDisplay from '@/components/RoadmapDisplay';

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
}

const RoadmapGeneratorPage: React.FC = () => {
  const params = useParams();
  const goalId = params.id as string;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [roadmapData, setRoadmapData] = useState<string | { roadmap: string; milestones: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);


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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);

  const handleGenerateRoadmap = async (timeframe: string, experience: string) => {
    if (!goal) return;

    setIsLoading(true);
    setError(null);
    setRoadmapData(null);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goal.title,
          timeframe,
          experience
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate roadmap');
      }

      setRoadmapData(data);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNewRoadmap = () => {
    setRoadmapData(null);
    setShowForm(true);
  };

  if (isLoading && !goal) return <div className="text-center py-8">Loading goal...</div>;
  if (error && !goal) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!goal) return <div className="text-center py-8">Goal not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Generate Roadmap for: {goal?.title}</h1>
      <p className="mb-8 text-gray-600 text-center">{goal?.description}</p>
      
      {showForm ? (
        <div className="max-w-md mx-auto">
          <RoadmapGeneratorForm onSubmit={handleGenerateRoadmap} goalTitle={goal?.title || ''} />
        </div>
      ) : (
        <div className="text-center mb-8">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Generate New Roadmap
          </button>
        </div>
      )}

      {isLoading && <div className="text-center py-8">Generating roadmap...</div>}
      {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
      
      {roadmapData && (
        <>
          <div className="mb-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            <p className="font-semibold">Roadmap generated successfully!</p>
            <p>Here's your personalized plan to achieve your goal.</p>
          </div>
          <RoadmapDisplay data={roadmapData} goalId={goalId} onSave={async (updatedRoadmap) => {
            // Implement the save logic here
            console.log('Saving updated roadmap:', updatedRoadmap);
            // You might want to make an API call to save the updated roadmap
          }} />
        </>
      )}

      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default RoadmapGeneratorPage;