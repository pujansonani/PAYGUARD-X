/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Outfit', 'sans-serif'],
        cyber: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        cyber: {
          950: '#030712',
          900: '#070c18',
          850: '#0b1326',
          800: '#111d38',
          700: '#1e2e54',
          cyan: '#00F0FF',
          red: '#FF3366',
          emerald: '#10B981',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          blue: '#3B82F6',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'neon-red': '0 0 20px -3px rgba(255, 51, 102, 0.35)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'neon-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
}
