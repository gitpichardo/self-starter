import React, { useState } from 'react';

interface RoadmapGeneratorFormProps {
  onSubmit: (timeframe: string, experience: string) => void;
  goalTitle: string;
}

const RoadmapGeneratorForm: React.FC<RoadmapGeneratorFormProps> = ({ onSubmit, goalTitle }) => {
  const [timeframe, setTimeframe] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(timeframe, experience);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Goal</label>
        <input
          type="text"
          id="goal"
          value={goalTitle}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">Timeframe</label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select timeframe</option>
          <option value="1 month">1 month</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="1 year">1 year</option>
        </select>
      </div>
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience Level</label>
        <select
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select experience level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generate Roadmap
      </button>
    </form>
  );
};

export default RoadmapGeneratorForm;