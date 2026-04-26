'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  border?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'none';
  id?: string;
}

export function Card({ children, className = '', border = 'none', id }: CardProps) {
  const borderClass = border !== 'none' ? `border-l-4 border-${border}` : '';

  return (
    <div
      id={id}
      className={`modern-card p-6 ${borderClass} ${className}`}
    >
      {children}
    </div>
  );
}
