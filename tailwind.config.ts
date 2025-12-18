import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fff0f0',  // Bonds N Beyond Red - very light tint for backgrounds
          100: '#ffe0e0', // Bonds N Beyond Red - light tint
          200: '#ffc0c0', // Bonds N Beyond Red - medium light tint
          300: '#ff8080', // Bonds N Beyond Red - light for focus rings
          400: '#ff4040', // Bonds N Beyond Red - medium
          500: '#ff0000', // Bonds N Beyond Red - primary brand color
          600: '#ff0000', // Bonds N Beyond Red - primary (matching 500 for consistency)
          700: '#cc0000', // Bonds N Beyond Red - darker for hover states
          800: '#990000', // Bonds N Beyond Red - very dark
          900: '#660000', // Bonds N Beyond Red - darkest
        },
      },
    },
  },
} satisfies Config
