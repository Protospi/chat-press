import React from 'react';

interface ProgressBarProps {
  progress: number;
  total: number;
  currentStep: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total, currentStep }) => {
  const percentage = (progress / total) * 100;

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Gerando GIF</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-[#6D5BEE] h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-600">{currentStep}</div>
    </div>
  );
}; 