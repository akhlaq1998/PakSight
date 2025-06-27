
import React from 'react';
import { Card } from './Card'; // Corrected path

interface StrategicOverviewCardProps {
  overviewText: string;
  timePeriod: string;
}

export const StrategicOverviewCard: React.FC<StrategicOverviewCardProps> = ({ overviewText, timePeriod }) => {
  return (
    <Card title={`Strategic Overview (${timePeriod})`} className="h-full">
      <p className="text-brand-text-dark leading-relaxed">
        {overviewText}
      </p>
    </Card>
  );
};