
import React from 'react';

interface SafetyScoreProps {
  score: number;
  labels?: string[];
  className?: string;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score, labels = [], className = "" }) => {
  // Round the score to the nearest 0.5
  const roundedScore = Math.round(score * 2) / 2;
  
  // Create an array of 5 items to represent the circles
  const scoreArray = Array(5).fill(0).map((_, index) => {
    const value = index + 1;
    return value <= roundedScore ? "active" : "inactive";
  });

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="safety-score flex items-center">
        {scoreArray.map((type, index) => (
          <span
            key={index}
            className={`safety-score-item ${type}`}
            aria-hidden="true"
          />
        ))}
        <span className="ml-2 text-sm font-medium">{roundedScore.toFixed(1)}</span>
      </div>
      
      {labels && labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {labels.map((label, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-nexlot-50 text-nexlot-700"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyScore;
