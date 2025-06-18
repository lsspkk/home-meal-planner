import React from 'react';

interface DateNavContainerProps {
  children: React.ReactNode;
}

export function DateNavContainer({ children }: DateNavContainerProps) {
  return (
    <div className="md:static md:mt-6 fixed bottom-0 left-0 w-full bg-white border-t z-40 md:bg-transparent md:border-0">
      <div className="flex items-center justify-between p-4 md:p-0 md:py-2 md:max-w-2xl lg:max-w-4xl mx-auto md:bg-gray-50 md:rounded-lg md:shadow-sm">
        {children}
      </div>
    </div>
  );
} 