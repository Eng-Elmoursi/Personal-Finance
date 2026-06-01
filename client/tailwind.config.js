/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gravity-base': '#050816',
        'gravity-surface': 'rgba(15, 20, 35, 0.6)',
        'gravity-primary': '#00F5D4',
        'gravity-secondary': '#4CC9F0',
        'gravity-accent': '#7B61FF',
      }
    },
  },
  plugins: [],
}
