/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        },
        colors: {
          paper: '#faf8f5',
          ink: {
            DEFAULT: '#1c1917',
            muted: '#57534e',
            faint: '#a8a29e',
          },
          accent: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            300: '#5eead4',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            900: '#134e4a',
          },
          hgtv: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
          }
        },
        boxShadow: {
          card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 4px 16px rgba(28, 25, 23, 0.06)',
          lift: '0 2px 4px rgba(28, 25, 23, 0.06), 0 12px 28px rgba(28, 25, 23, 0.10)',
        },
      },
    },
    plugins: [],
  }
