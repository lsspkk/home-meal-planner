import React from 'react';

interface DateNavContainerProps {
  children: React.ReactNode;
}

export function DateNavContainer({ children }: DateNavContainerProps) {
  return (
    <div className="sm:static sm:mt-0 fixed bottom-0 left-0 w-full bg-white border-t z-40 sm:bg-transparent sm:border-0">
      <div className="flex items-center justify-between p-4 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );
} 