/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#52525b',
          faint: '#a1a1aa',
        },
        paper: '#ffffff',
        line: '#e7e5e4',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-noto-sans-jp)', 'system-ui', 'sans-serif'],
        jp: ['var(--font-noto-sans-jp)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
