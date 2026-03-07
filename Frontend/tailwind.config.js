/** @type {import('tailwindcss').Config} */
export default {
  // Scan all TSX/TS files so Tailwind generates only the used classes
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ── Brand Colors ──────────────────────────────────────────────────────
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // primary indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316', // warm orange accent
          600: '#ea580c',
        },
      },
      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cal Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      // ── Backdrop Blur (glassmorphism) ─────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
      // ── Custom Shadows ────────────────────────────────────────────────────
      boxShadow: {
        card:    '0 4px 24px -1px rgba(0,0,0,.10), 0 2px 8px -1px rgba(0,0,0,.06)',
        'card-hover': '0 16px 48px -4px rgba(0,0,0,.16), 0 6px 16px -2px rgba(0,0,0,.08)',
        glass:   '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      },
      // ── Animation Keyframes ───────────────────────────────────────────────
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:  'shimmer 1.6s infinite',
        'fade-in':'fade-in 0.4s ease both',
      },
    },
  },
  plugins: [],
}


