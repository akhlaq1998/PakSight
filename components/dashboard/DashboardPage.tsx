
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './Navbar';
import { FilterBar } from './FilterBar'; // New component
import { StrategicOverviewCard } from './StrategicOverviewCard';
import { MentionFrequencyCard } from './MentionFrequencyCard';
import { SentimentBreakdownCard } from './SentimentBreakdownCard';
import { TopTopicsCard } from './TopTopicsCard';
import { ArticleHighlightsSection } from './ArticleHighlightsSection';
import { AIStrategicAssistantCard } from './AIStrategicAssistantCard';
import { TimePeriod, Article, SentimentData, TopicData } from '../../types';
import { getMockDashboardData, MOCK_MENTION_SOURCES, ALL_MOCK_ARTICLES } from '../../constants';

interface DashboardPageProps {
  teamName: string;
  onSetTeamName: (name: string) => void;
}

interface DashboardData {
  strategicOverview: string;
  mentionFrequency: number;
  sentimentBreakdown: SentimentData[];
  topTopics: TopicData[];
  articles: Article[]; // All articles, filtering will be done by components or here
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ teamName, onSetTeamName }) => {
  const [activeTimePeriod, setActiveTimePeriod] = useState<TimePeriod>(TimePeriod.Weekly);
  const [dashboardData, setDashboardData] = useState<DashboardData>(getMockDashboardData(activeTimePeriod));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchDataForPeriod = useCallback((period: TimePeriod) => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setDashboardData(getMockDashboardData(period));
      setIsRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchDataForPeriod(activeTimePeriod);
  }, [activeTimePeriod, fetchDataForPeriod]);

  const handleSetPeriod = (period: TimePeriod) => {
    setActiveTimePeriod(period);
  };

  const handleRefreshData = () => {
    fetchDataForPeriod(activeTimePeriod);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar teamName={teamName} onSetTeamName={onSetTeamName} />
      <main className="container mx-auto p-4 md:p-6 space-y-6 flex-grow">
        <FilterBar 
          activePeriod={activeTimePeriod}
          onSetPeriod={handleSetPeriod}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        {/* Row 1: Strategic Overview & AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StrategicOverviewCard 
              overviewText={dashboardData.strategicOverview}
              timePeriod={activeTimePeriod}
            />
          </div>
          <div className="lg:col-span-1">
            <AIStrategicAssistantCard /> {/* This card manages its own data for now */}
          </div>
        </div>

        {/* Row 2: Data Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MentionFrequencyCard 
            frequency={dashboardData.mentionFrequency}
            sources={MOCK_MENTION_SOURCES} // Sources can remain static or be part of dashboardData
            timePeriod={activeTimePeriod}
          />
          <SentimentBreakdownCard 
            data={dashboardData.sentimentBreakdown}
            timePeriod={activeTimePeriod}
          />
          <TopTopicsCard 
            data={dashboardData.topTopics}
            timePeriod={activeTimePeriod}
          />
        </div>

        {/* Row 3: Article Highlights */}
        <div className="grid grid-cols-1 gap-6">
           <ArticleHighlightsSection 
             allArticles={ALL_MOCK_ARTICLES} // Pass all articles for local filtering
             activeTimePeriod={activeTimePeriod}
           />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-brand-text-medium border-t border-brand-nav-blue mt-8">
        © {new Date().getFullYear()} PakSight. All rights reserved.
      </footer>
    </div>
  );
};
