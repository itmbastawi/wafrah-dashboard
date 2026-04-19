import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'health-healthy': '#10b981',
        'health-warning': '#f59e0b',
        'health-critical': '#ef4444',
      },
    },
  },
  plugins: [],
};

export default config;
