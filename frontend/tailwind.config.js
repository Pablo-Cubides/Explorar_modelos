/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00F5FF',      // Cyan eléctrico
        secondary: '#FF0055',    // Rojo vibrante
        accent: '#FFD700',       // Oro cálido
        background: '#000000',   // Negro puro
        surface: '#0a0a0a',      // Negro ligeramente más claro
        'surface-light': 'rgba(255, 255, 255, 0.03)',
        'surface-lighter': 'rgba(255, 255, 255, 0.06)',
        'glow-cyan': 'rgba(0, 245, 255, 0.3)',
        'glow-red': 'rgba(255, 0, 85, 0.3)',
        'glow-gold': 'rgba(255, 215, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #00F5FF 0%, #FF0055 100%)',
        'gradient-cyber-reverse': 'linear-gradient(135deg, #FF0055 0%, #00F5FF 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(0, 245, 255, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 0, 85, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 215, 0, 0.1) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2)',
        'glow-red': '0 0 20px rgba(255, 0, 85, 0.4), 0 0 40px rgba(255, 0, 85, 0.2)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)',
        'glow-cyber': '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(255, 0, 85, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 245, 255, 0.1)',
        'glass-hover': '0 12px 48px 0 rgba(0, 245, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    }
  },
  plugins: []
}
