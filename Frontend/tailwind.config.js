/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        glass: {
          white: 'rgba(255,255,255,0.7)',
          dark:  'rgba(15,23,42,0.6)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%, transparent 100%)',
        'auth-gradient': 'linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #1e1b4b 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass:    '0 8px 32px 0 rgba(99,102,241,0.12)',
        'glass-lg': '0 20px 60px rgba(99,102,241,0.18)',
        'card-hover': '0 25px 50px -12px rgba(99,102,241,0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0'  },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        float:   'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
