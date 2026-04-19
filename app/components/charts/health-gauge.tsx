'use client';

import { useEffect, useRef } from 'react';

interface HealthGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function HealthGauge({ score, size = 120, strokeWidth = 12 }: HealthGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth) / 2;

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    const startAngle = Math.PI * 0.75;
    const endAngle = startAngle + (Math.max(0, Math.min(100, score)) / 100) * (Math.PI * 1.5);

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#ef4444');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient as unknown as string;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.font = `bold ${size * 0.25}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score.toFixed(1), centerX, centerY + size * 0.03);

    ctx.font = `${size * 0.09}px sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText('Health Score', centerX, centerY - size * 0.22);
  }, [score, size, strokeWidth]);

  return <canvas ref={canvasRef} className="mx-auto" style={{ width: size, height: size }} />;
}
