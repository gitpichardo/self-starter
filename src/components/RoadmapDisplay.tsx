
import React from 'react';

interface RoadmapDisplayProps {
  data: string | { roadmap: string; milestones: string[] };
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ data }) => {
  let roadmapText: string;
  let milestones: string[] | undefined;

  if (typeof data === 'string') {
    roadmapText = data;
  } else {
    roadmapText = data.roadmap;
    milestones = Array.isArray(data.milestones) ? data.milestones : undefined;
  }

  const parseRoadmap = (roadmap: string) => {
    const sections = roadmap.split('\n\n');
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n');
      const title = lines[0].replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
      const items = lines.slice(1);

      return (
        <div key={sectionIndex} className="mb-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-3">{title}</h3>
          <ul className="space-y-2 pl-6">
            {items.map((item, itemIndex) => {
              if (item.startsWith('- **')) {
                // Sub-heading
                return (
                  <li key={itemIndex} className="font-semibold text-gray-800 mt-4">
                    {item.replace(/^-\s*\*\*|\*\*$/g, '').trim()}
                  </li>
                );
              } else if (item.startsWith('-')) {
                // Regular list item
                return (
                  <li key={itemIndex} className="text-gray-700 pl-4">
                    {item.replace(/^-\s*/, '').trim()}
                  </li>
                );
              } else {
                // Regular text
                return (
                  <li key={itemIndex} className="text-gray-700">
                    {item.trim()}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-indigo-600">
        <h2 className="text-2xl font-bold text-white">Your Personalized Roadmap</h2>
      </div>
      <div className="p-6">
        <div className="prose max-w-none">
          {parseRoadmap(roadmapText)}
        </div>
        
        {milestones && milestones.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Milestones</h3>
            <ul className="space-y-2">
              {milestones.map((milestone, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDisplay;