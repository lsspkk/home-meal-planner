import React from 'react';


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'default' | 'none' | 'tight';
}

export function Card({ children, className, padding = 'default', ...props }: CardProps) {
  const paddingClasses = {
    default: 'p-4 md:p-6',
    none: 'p-0',
    tight: 'p-2 md:p-4',
  };

  const baseStyles = 'border-t border-b md:border md:rounded-lg md:shadow-sm bg-white';
  const paddingClass = paddingClasses[padding];

  const combinedClassName = [baseStyles, paddingClass, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
} 