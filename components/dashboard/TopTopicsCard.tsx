
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './Card'; // Corrected path
import type { TopicData } from '../../types'; // No longer using MOCK from constants

interface TopTopicsCardProps {
  data: TopicData[];
  timePeriod: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 shadow-md rounded-md">
        <p className="font-semibold">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export const TopTopicsCard: React.FC<TopTopicsCardProps> = ({ data, timePeriod }) => {
  return (
    <Card title={`Top Topics (${timePeriod})`} className="h-full">
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value, entry) => <span className="text-xs text-brand-text-medium">{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};