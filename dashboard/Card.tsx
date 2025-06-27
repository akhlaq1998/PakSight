
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className, titleClassName }) => {
  return (
    <div className={`bg-brand-card-bg shadow-lg rounded-lg p-6 ${className || ''}`}>
      {title && <h2 className={`text-xl font-semibold text-brand-text-dark mb-4 ${titleClassName || ''}`}>{title}</h2>}
      {children}
    </div>
  );
};
