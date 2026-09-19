/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff5e3a',
          dark: '#e8492a',
          light: '#ff7d5f',
        },
        ink: '#1f1b16',
        muted: '#6b6259',
        cream: '#fff7f2',
        // dark-mode surfaces
        night: '#16130f',
        'night-soft': '#211c17',
        'night-card': '#26201a',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        script: ['Pacifico', 'cursive'],
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(31, 27, 22, 0.25)',
        card: '0 12px 30px -12px rgba(31, 27, 22, 0.2)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease both',
      },
    },
  },
  plugins: [],
}
