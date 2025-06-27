
import React from 'react';
import { TimePeriod } from '../../types';
import { ArrowPathIcon, CalendarDaysIcon } from '../icons';

interface FilterBarProps {
  activePeriod: TimePeriod;
  onSetPeriod: (period: TimePeriod) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

const timePeriods: TimePeriod[] = [TimePeriod.Daily, TimePeriod.Weekly, TimePeriod.Monthly, TimePeriod.Yearly];

export const FilterBar: React.FC<FilterBarProps> = ({ activePeriod, onSetPeriod, onRefreshData, isRefreshing }) => {
  return (
    <div className="bg-brand-nav-blue p-3 rounded-lg shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-2 text-brand-text-light">
        <CalendarDaysIcon className="w-5 h-5 text-brand-secondary" />
        <span className="text-sm font-medium">Analysis Period:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {timePeriods.map((period) => (
          <button
            key={period}
            onClick={() => onSetPeriod(period)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150
              ${activePeriod === period 
                ? 'bg-brand-primary text-white shadow-sm' 
                : 'bg-brand-dialog-blue text-brand-text-medium hover:bg-brand-primary/80 hover:text-white'
              }`}
          >
            {period}
          </button>
        ))}
      </div>
      <button
        onClick={onRefreshData}
        disabled={isRefreshing}
        className="flex items-center px-4 py-1.5 text-xs font-medium bg-brand-accent text-white rounded-md hover:bg-opacity-80 transition-colors duration-150 disabled:opacity-60"
      >
        <ArrowPathIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  );
};
