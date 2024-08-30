import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
  onRefresh: () => void;
}

interface EditGoalFormProps {
  goal: Goal;
  onSave: (updatedGoal: Goal) => void;
  onCancel: () => void;
}

const EditGoalForm: React.FC<EditGoalFormProps> = ({ goal, onSave, onCancel }) => {
  const [editedGoal, setEditedGoal] = useState(goal);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedGoal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={editedGoal.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        value={editedGoal.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="status"
        value={editedGoal.status}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Save</button>
      </div>
    </form>
  );
};

const GoalList: React.FC<GoalListProps> = ({ refreshTrigger, onRefresh }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

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

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleUpdate = async (updatedGoal: Goal) => {
    try {
      const response = await fetch(`/api/goals/${updatedGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal),
      });
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setEditingGoal(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating');
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      setGoals(goals.filter(g => g.id !== goalId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting');
    }
  };

  if (isLoading) return <div>Loading goals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <button 
          onClick={() => { fetchGoals(); onRefresh(); }}
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
              {editingGoal?.id === goal.id ? (
                <EditGoalForm goal={editingGoal} onSave={handleUpdate} onCancel={() => setEditingGoal(null)} />
              ) : (
                <>
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
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                    <Link href={`/goals/${goal.id}/roadmap`}>
                      <span className="text-green-600 hover:text-green-800 cursor-pointer">
                        Generate Roadmap
                      </span>
                    </Link>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalList;