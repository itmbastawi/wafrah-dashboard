"use client";

import { ChannelData } from "@/lib/data";

interface ChannelBarsProps {
  channels: ChannelData[];
}

export default function ChannelBars({ channels }: ChannelBarsProps) {
  const maxPercentage = Math.max(...channels.map((c) => c.percentage));

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border">
      <h2 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Channel Breakdown</h2>
      <div className="space-y-4" role="list" aria-label="Channel performance">
        {channels.map((channel) => (
          <div key={channel.name} role="listitem">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">{channel.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ${(channel.value / 1000000).toFixed(2)}M ({channel.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 w-full overflow-hidden">
              <div
                className="h-full bg-aura-gold transition-all duration-500"
                style={{ width: `${(channel.percentage / maxPercentage) * 100}%` }}
                role="progressbar"
                aria-valuenow={channel.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${channel.name}: ${channel.percentage}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}