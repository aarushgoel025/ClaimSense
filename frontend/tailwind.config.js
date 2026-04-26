/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Standard (Arctic)
        'arctic-bg': '#F8FAFC',
        'arctic-secondary': '#EFF4FB',
        'arctic-card': '#FFFFFF',
        'arctic-card-subtle': '#EBF2FF',
        'navy-deep': '#0A1628',
        'navy-mid': '#1E3A5F',
        'electric-blue': '#1D6FF2',
        
        // Hogwarts (Mystic)
        'mystic-bg': '#121411',
        'mystic-card': '#1A1E1A',
        'mystic-card-hover': '#252B24',
        'mystic-border': '#2D352B',
        'mystic-accent': '#D4AF37',
        'mystic-accent-hover': '#E6C669',
        'mystic-text': '#F0F0E6',
        'mystic-text-muted': '#9AA696',
        'mystic-dark': '#0B0D0A',

        // Shared Semantic
        'success-green': '#0D9E6E',
        'warning-amber': '#E8900A',
        'danger-red': '#D93B3B',
        'text-muted': '#7A92A9',
        'border-default': '#DAEAF7',
        'neon-orange': '#FF5E00',
        'neon-orange-dark': '#E65500',
        'clara-lime': '#DEE754',
        'clara-orange': '#ed7b58',
      },
      fontFamily: {
        'display': ['Sora', 'sans-serif'], // We will handle font switching via CSS variables or specific classes later
        'sans': ['DM Sans', 'sans-serif'],
        'mono': ['"IBM Plex Mono"', 'monospace'],
        'magic-display': ['Cinzel', 'serif'],
        'magic-sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mystic-gradient': 'linear-gradient(180deg, #1A1E1A 0%, #121411 100%)',
      },
      boxShadow: {
        'card-elevated': '0 2px 12px rgba(10, 22, 40, 0.07), 0 1px 3px rgba(10, 22, 40, 0.05)',
        'card-hover': '0 8px 32px rgba(29, 111, 242, 0.14), 0 2px 8px rgba(10, 22, 40, 0.08)',
        'card-active': '0 12px 48px rgba(29, 111, 242, 0.20)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
