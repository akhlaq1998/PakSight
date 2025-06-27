
import React, { useState, useMemo } from 'react';
import { Card } from './Card'; // Corrected path
import { ArticleCard } from './ArticleCard';
// MOCK_ARTICLES is no longer directly used here, data comes from props.
import { TimePeriod, type Article } from '../../types';

const TABS = ["European Union", "Hungary"];

interface ArticleHighlightsSectionProps {
  allArticles: Article[];
  activeTimePeriod: TimePeriod;
}

const filterArticlesByTimePeriod = (articles: Article[], period: TimePeriod): Article[] => {
  const now = new Date();
  let startDate = new Date(now);

  switch (period) {
    case TimePeriod.Daily:
      startDate.setDate(now.getDate() - 1);
      break;
    case TimePeriod.Weekly:
      startDate.setDate(now.getDate() - 7);
      break;
    case TimePeriod.Monthly:
      startDate.setMonth(now.getMonth() - 1);
      break;
    case TimePeriod.Yearly:
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default: // Should not happen
      return articles;
  }
  // Ensure we compare date parts only, ignoring time for daily/weekly/monthly/yearly spans
  const startOfPeriod = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  return articles.filter(article => {
    const articleDate = new Date(article.date.getFullYear(), article.date.getMonth(), article.date.getDate());
    return articleDate >= startOfPeriod && articleDate <= now;
  });
};


export const ArticleHighlightsSection: React.FC<ArticleHighlightsSectionProps> = ({ allArticles, activeTimePeriod }) => {
  const [activeSourceTab, setActiveSourceTab] = useState<string>(TABS[0]);

  const articlesForPeriod = useMemo(() => {
    return filterArticlesByTimePeriod(allArticles, activeTimePeriod);
  }, [allArticles, activeTimePeriod]);

  const filteredArticlesBySource = useMemo(() => {
    return articlesForPeriod.filter(article => article.source === activeSourceTab).slice(0, 3);
  }, [articlesForPeriod, activeSourceTab]);

  return (
    <Card title={`Article Highlights (${activeTimePeriod})`} className="col-span-1 md:col-span-3">
      <div className="mb-4 border-b border-slate-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSourceTab(tab)}
              className={`${
                activeSourceTab === tab
                  ? 'border-brand-primary text-brand-primary font-semibold border-b-4'
                  : 'border-transparent text-brand-text-medium hover:text-brand-text-dark hover:border-slate-300 border-b-2'
              } whitespace-nowrap py-3 px-2 text-sm transition-colors duration-150 focus:outline-none`}
              aria-current={activeSourceTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {filteredArticlesBySource.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticlesBySource.map((article: Article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-brand-text-medium text-center py-4">No articles found for {activeSourceTab} in the {activeTimePeriod.toLowerCase()} period.</p>
      )}
    </Card>
  );
};