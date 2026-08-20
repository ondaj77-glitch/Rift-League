/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#fcd472',
          400: '#f5c030',
          500: '#c89b3c',
          600: '#a07820',
        },
        rift: {
          bg: '#0a0a12',
          surface: '#12121e',
          card: '#1a1a2e',
          border: '#2a2a42',
          purple: '#7c3aed',
          'purple-light': '#a78bfa',
        }
      },
      fontFamily: {
        display: ['"Rajdhani"', '"Inter"', 'sans-serif'],
        heading: ['"Rajdhani"', '"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(197,155,60,0)' },
          '50%': { boxShadow: '0 0 20px rgba(197,155,60,0.4)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px rgba(197,155,60,0.3)' },
          '100%': { textShadow: '0 0 30px rgba(197,155,60,0.8), 0 0 60px rgba(197,155,60,0.3)' },
        }
      }
    },
  },
  plugins: [],
}
