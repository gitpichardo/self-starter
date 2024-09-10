import React, { useState, FormEvent, ChangeEvent } from 'react';

interface GoalInputFormProps {
  onGoalCreated: (goalData: any) => Promise<void>;
}

const GoalInputForm: React.FC<GoalInputFormProps> = ({ onGoalCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, startDate, endDate, status }),
      });

      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create goal: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log('Goal created:', data);
      setSuccessMessage('Goal created successfully!');
      onGoalCreated(data); // Trigger refresh of goal list

      // Clear form after successful submission
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Set Your Goal</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Goal Title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <textarea
            placeholder="Goal Description (optional)"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date (optional)
          </label>
          <input
            id="endDate"
            type="date"
            placeholder="End Date (optional)"
            value={endDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <select
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Set Goal'}
        </button>
      </form>
    </div>
  );
};

export default GoalInputForm;