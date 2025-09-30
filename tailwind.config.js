/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: true, // this is prevent tailwind from adding base styles.
  },
  // important: '.semaphor-custom', // scoping all tailwind styles to the semaphor-custom class. The top level div in the app must have this class to get tailwind styles to work.
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--semaphor-custom-radius)',
        md: 'calc(var(--semaphor-custom-radius) - 2px)',
        sm: 'calc(var(--semaphor-custom-radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--semaphor-custom-background))',
        foreground: 'hsl(var(--semaphor-custom-foreground))',
        card: {
          DEFAULT: 'hsl(var(--semaphor-custom-card))',
          foreground: 'hsl(var(--semaphor-custom-card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--semaphor-custom-popover))',
          foreground: 'hsl(var(--semaphor-custom-popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--semaphor-custom-primary))',
          foreground: 'hsl(var(--semaphor-custom-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--semaphor-custom-secondary))',
          foreground: 'hsl(var(--semaphor-custom-secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--semaphor-custom-muted))',
          foreground: 'hsl(var(--semaphor-custom-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--semaphor-custom-accent))',
          foreground: 'hsl(var(--semaphor-custom-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--semaphor-custom-destructive))',
          foreground: 'hsl(var(--semaphor-custom-destructive-foreground))',
        },
        border: 'hsl(var(--semaphor-custom-border))',
        input: 'hsl(var(--semaphor-custom-input))',
        ring: 'hsl(var(--semaphor-custom-ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
