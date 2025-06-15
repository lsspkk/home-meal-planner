import React from 'react';

interface PageProps {
  children: React.ReactNode;
}

export function Page({ children }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto px-1 sm:p-6 lg:p-8 sm:space-y-6">
      {children}
    </div>
  );
} 