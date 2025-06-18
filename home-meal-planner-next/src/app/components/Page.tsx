import React from 'react';

interface PageProps {
  children: React.ReactNode;
}

export function Page({ children }: PageProps) {
  return (
    <div className="w-full md:max-w-2xl lg:max-w-4xl mx-auto px-4 md:px-6 lg:px-8 md:space-y-6">
      {children}
    </div>
  );
} 