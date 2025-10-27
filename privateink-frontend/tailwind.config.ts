import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 自定义颜色 - 必须在这里定义才能让Tailwind生成动态类
        primary: '#a855f7',
        secondary: '#7c3aed',
        accent: '#6366f1',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        textSecondary: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionDuration: {
        normal: '200ms',
        fast: '100ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
