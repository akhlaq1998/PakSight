
import React from 'react';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = article.date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <h3 className="text-md font-semibold text-brand-primary mb-1">{article.title}</h3>
      <p className="text-xs text-brand-text-medium mb-2">{formattedDate}</p>
      <p className="text-sm text-brand-text-dark mb-2 flex-grow">{article.summary}</p>
      <p className="text-xs text-brand-text-medium mt-auto">
        <span className="font-semibold">Main Topic:</span> {article.mainTopic}
      </p>
    </div>
  );
};
