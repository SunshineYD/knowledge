/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#EC4899',
        accent: '#F59E0B',
        success: '#10B981',
        info: '#3B82F6',
        warning: '#F59E0B',
        danger: '#EF4444',
        light: '#F3F4F6',
        dark: '#1F2937',
      },
      fontFamily: {
        sans: ['Comic Sans MS', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}