'use client';

import React, { useEffect, useState } from 'react';

interface HealthGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  id?: string;
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#34d399';
  if (score >= 50) return '#fbbf24';
  return '#fb7185';
}

function getScoreStatus(score: number): string {
  if (score >= 75) return 'HEALTHY';
  if (score >= 50) return 'WARNING';
  return 'CRITICAL';
}

function getScoreGlow(score: number): string {
  if (score >= 75) return 'rgba(52, 211, 153, 0.3)';
  if (score >= 50) return 'rgba(251, 191, 36, 0.3)';
  return 'rgba(251, 113, 133, 0.3)';
}

export function HealthGauge({
  score,
  size = 220,
  strokeWidth = 14,
  label = 'Overall Health',
  id,
}: HealthGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const status = getScoreStatus(score);
  const glow = getScoreGlow(score);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div id={id} className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(99, 117, 171, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={glow}
          strokeWidth={strokeWidth + 8}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.1s ease-out',
            filter: 'blur(8px)',
          }}
        />
        {/* Main arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.1s ease-out',
          }}
        />
      </svg>
      {/* Center text overlay */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          className="font-bold tracking-tight"
          style={{ fontSize: size * 0.2, color }}
        >
          {Math.round(animatedScore)}
        </span>
        <span
          className="text-text-secondary font-medium uppercase tracking-widest"
          style={{ fontSize: size * 0.055 }}
        >
          {status}
        </span>
      </div>
      <p className="text-text-secondary text-sm font-medium tracking-wide">
        {label}
      </p>
    </div>
  );
}
