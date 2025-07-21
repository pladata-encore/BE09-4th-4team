/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // 기존 Vite 경로 유지 시
  ],
  theme: {
    fontFamily: {
      sans: ['NotoSansKR', 'sans-serif'],
      cj: ['cj_onlyone_new_medium', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, rgba(19, 21, 24, 0) 0%, rgba(19, 21, 24, .4) 100%)',
      },
    },
  },
  plugins: [],
};
