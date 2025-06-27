
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './Card'; // Corrected path
import type { SentimentData } from '../../types'; // No longer using MOCK from constants

interface SentimentBreakdownCardProps {
  data: SentimentData[];
  timePeriod: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 shadow-md rounded-md">
        <p className="font-semibold">{`${label}`}</p>
        <p style={{ color: payload[0].payload.fill }}>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const SentimentBreakdownCard: React.FC<SentimentBreakdownCardProps> = ({ data, timePeriod }) => {
  return (
    <Card title={`Sentiment Breakdown (${timePeriod})`} className="h-full">
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-xs text-brand-text-medium"/>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(230, 230, 230, 0.4)'}}/>
            <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};