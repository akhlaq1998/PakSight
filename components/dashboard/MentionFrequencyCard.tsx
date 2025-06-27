
import React from 'react';
import { Card } from './Card'; // Corrected path

interface MentionFrequencyCardProps {
  frequency: number;
  sources: string[];
  timePeriod: string;
}

export const MentionFrequencyCard: React.FC<MentionFrequencyCardProps> = ({ frequency, sources, timePeriod }) => {
  // Simple deterministic progress based on frequency (example)
  const progressPercentage = Math.min(100, (frequency / 50) * 100); 

  return (
    <Card title={`Mention Frequency (${timePeriod})`} className="h-full">
      <div className="text-7xl font-bold text-brand-primary text-center my-4">
        {frequency}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="bg-brand-accent h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <h4 className="text-sm font-semibold text-brand-text-dark mb-2">Key Sources/Contexts:</h4>
      <ul className="space-y-1 text-sm text-brand-text-medium list-disc list-inside">
        {sources.map(source => (
          <li key={source}>{source}</li>
        ))}
      </ul>
    </Card>
  );
};