/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arctic-bg': '#F8FAFC',
        'arctic-secondary': '#EFF4FB',
        'arctic-card': '#FFFFFF',
        'arctic-card-subtle': '#EBF2FF',
        'navy-deep': '#0A1628',
        'navy-mid': '#1E3A5F',
        'electric-blue': '#1D6FF2',
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
        'display': ['Sora', 'sans-serif'],
        'sans': ['DM Sans', 'sans-serif'],
        'mono': ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'card-elevated': '0 2px 12px rgba(10, 22, 40, 0.07), 0 1px 3px rgba(10, 22, 40, 0.05)',
        'card-hover': '0 8px 32px rgba(29, 111, 242, 0.14), 0 2px 8px rgba(10, 22, 40, 0.08)',
        'card-active': '0 12px 48px rgba(29, 111, 242, 0.20)',
      }
    },
  },
  plugins: [],
}
