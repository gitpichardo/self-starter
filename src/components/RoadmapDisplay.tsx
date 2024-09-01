import React from 'react';
import ReactMarkdown from 'react-markdown';

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

  // Preprocess the markdown
  const cleanMarkdown = roadmapText
    .replace(/^(\d+\.|\-)\s*/gm, '') // Remove numbers and bullet points at the start of lines
    .replace(/^#+\s*(\d+\.?\s*)?/gm, ''); // Remove '#' symbols and numbers from headings

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-indigo-600">
        <h2 className="text-2xl font-bold text-white">Your Personalized Roadmap</h2>
      </div>
      <div className="p-6">
        <div className="prose max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-indigo-800" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-indigo-700" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-indigo-600" {...props} />,
              p: ({node, ...props}) => <p className="my-3 text-gray-700 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="my-3 space-y-2" {...props} />,
              li: ({node, ...props}) => (
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span className="text-gray-700" {...props} />
                </li>
              ),
            }}
          >
            {cleanMarkdown}
          </ReactMarkdown>
        </div>
        
        {milestones && milestones.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">Key Milestones</h3>
            <ul className="space-y-4">
              {milestones.map((milestone, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-indigo-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-indigo-700">{milestone}</h4>
                    <p className="text-gray-600 mt-1">Focus on achieving this milestone to progress towards your goal.</p>
                  </div>
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