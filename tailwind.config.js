/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
        brand: ["Fredoka", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          light: '#EAE6DF',
          dark: '#2D2A26',
          accent: '#5A5A40',
        },
        'ruru': {
          teal: '#34b5c7',
          'teal-light': '#6ccdd6',
          'teal-pale': '#8ebbc4',
          magenta: '#a150a0',
          'pink-dark': '#d16bb6',
          pink: '#eb99d3',
          'pink-pale': '#f5c9d1',
          blue: '#5979b0',
          purple: '#432e63',
          navy: '#0b1424',
          'navy-light': '#192b45'
        },
        'soft': {
          blue: '#e0f2fe',
          purple: '#f3e8ff',
          green: '#dcfce7',
          pink: '#fce7f3',
          amber: '#fef3c7',
          slate: '#f8fafc',
          ink: '#0f172a'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
