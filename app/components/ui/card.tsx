'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' | 'none';
  id?: string;
}

export function Card({ children, className = '', glow = 'none', id }: CardProps) {
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';

  return (
    <div
      id={id}
      className={`glass-card p-6 ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
