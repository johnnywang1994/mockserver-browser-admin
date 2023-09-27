/** @type {import('tailwindcss').Config} */
const defaultFontFamily = [
  'PingFang TC',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Microsoft JhengHei',
  'Helvetica Neue',
  'Helvetica',
  'Arial',
  'sans-serif',
  'system-ui',
];

const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: defaultFontFamily,
    },
  },
};

export default config;
