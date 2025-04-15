module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'slow-fade': 'fade 15s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fade: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(99,102,241,0.4)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(99,102,241,0.8)',
          },
        },
      },
    },
  },
  plugins: [],
};
