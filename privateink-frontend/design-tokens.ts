import crypto from 'crypto';

// Calculate deterministic seed for design uniqueness
const projectName = "PrivateInk";
const network = "sepolia";
const yearMonth = "202510";
const contractName = "PrivateInkBlog.sol";
const seedString = `${projectName}${network}${yearMonth}${contractName}`;
const seed = crypto.createHash('sha256').update(seedString).digest('hex');

// Based on seed, select design dimensions
const seedNum = parseInt(seed.substring(0, 8), 16);

// Design system: Glassmorphism with Purple theme
export const designTokens = {
  system: 'Glassmorphism',
  seed: seed,
  
  colors: {
    light: {
      // Purple theme (E group)
      primary: '#A855F7',        // Purple
      secondary: '#7C3AED',      // Deep Purple
      accent: '#6366F1',         // Indigo
      background: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceGlass: 'rgba(248, 250, 252, 0.7)',
      text: '#0F172A',
      textSecondary: '#64748B',
      border: 'rgba(148, 163, 184, 0.2)',
      hover: 'rgba(168, 85, 247, 0.1)',
    },
    dark: {
      primary: '#C084FC',        // Light Purple
      secondary: '#A78BFA',      // Light Deep Purple
      accent: '#818CF8',         // Light Indigo
      background: '#0F172A',
      surface: '#1E293B',
      surfaceGlass: 'rgba(30, 41, 59, 0.7)',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: 'rgba(148, 163, 184, 0.1)',
      hover: 'rgba(192, 132, 252, 0.1)',
    },
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    scale: 1.25,
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.25rem',      // 20px
      xl: '1.563rem',     // 25px
      '2xl': '1.953rem',  // 31px
      '3xl': '2.441rem',  // 39px
      '4xl': '3.052rem',  // 49px
    },
  },
  
  spacing: {
    unit: 8, // Base spacing unit in pixels
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px - our selected size
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  
  glassmorphism: {
    // Glassmorphism specific properties
    backdrop: 'blur(10px) saturate(180%)',
    backdropStrong: 'blur(20px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  
  transitions: {
    duration: {
      fast: '100ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  layout: {
    mode: 'tabs',  // Tabs layout (top navigation)
    maxWidth: '1280px',
    containerPadding: '1rem',
  },
  
  density: {
    compact: {
      padding: {
        sm: '0.25rem 0.5rem',   // 4px 8px
        md: '0.5rem 1rem',      // 8px 16px
        lg: '0.75rem 1.5rem',   // 12px 24px
      },
      gap: '0.5rem',  // 8px
    },
    comfortable: {
      padding: {
        sm: '0.5rem 1rem',      // 8px 16px
        md: '1rem 1.5rem',      // 16px 24px
        lg: '1.25rem 2rem',     // 20px 32px
      },
      gap: '1rem',  // 16px
    },
  },
  
  breakpoints: {
    mobile: '0px',      // < 768px
    tablet: '768px',    // 768px - 1024px
    desktop: '1024px',  // > 1024px
  },
  
  accessibility: {
    focusRing: '2px solid',
    focusOffset: '2px',
    minContrastRatio: 4.5, // WCAG AA
  },
};

export type DesignTokens = typeof designTokens;

