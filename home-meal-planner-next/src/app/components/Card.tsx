import React from 'react';


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'default' | 'none' | 'tight';
}

export function Card({ children, className, padding = 'default', ...props }: CardProps) {
  const paddingClasses = {
    default: 'p-2 sm:p-4 md:p-8',
    none: 'p-0 sm:p-1 md:p-2',
    tight: 'p-1 sm:p-2 md:p-4',
  };

  const baseStyles = 'border-t border-b md:border sm:rounded-lg sm:shadow-sm';
  const paddingClass = paddingClasses[padding];

  const combinedClassName = [baseStyles, paddingClass, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
} 