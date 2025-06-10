import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {children && <div className="mt-2 sm:mt-0">{children}</div>}
    </div>
  );
} 