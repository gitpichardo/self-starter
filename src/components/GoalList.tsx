import React, { useEffect, useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
}

interface GoalListProps {
  refreshTrigger: number;
}

const GoalList: React.FC<GoalListProps> = ({ refreshTrigger }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    setIsLoading(true);
    setError(null);
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

  useEffect(() => {
    fetchGoals();
  }, [refreshTrigger]);

  if (isLoading) return <div>Loading goals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <button 
          onClick={fetchGoals}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Goals
        </button>
      </div>
      {goals.length === 0 ? (
        <p className="text-gray-600">You haven't set any goals yet.</p>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li key={goal.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
              <p className="text-gray-600 mt-1">{goal.description}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                  goal.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  goal.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Start Date: {new Date(goal.startDate).toLocaleDateString()}</p>
              {goal.endDate && <p className="text-sm text-gray-500">End Date: {new Date(goal.endDate).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalList;