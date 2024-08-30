import React, { useEffect, useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
}

const GoalList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/goals');
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (isLoading) return <div>Loading goals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
      {goals.length === 0 ? (
        <p>You haven't set any goals yet.</p>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li key={goal.id} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{goal.title}</h3>
              <p>{goal.description}</p>
              <p>Status: {goal.status}</p>
              <p>Start Date: {new Date(goal.startDate).toLocaleDateString()}</p>
              {goal.endDate && <p>End Date: {new Date(goal.endDate).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalList;