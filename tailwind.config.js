/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: { '2xl': '1280px' },
		},
		extend: {
			fontFamily: {
				// Both families carry full Hebrew coverage, so `font-sans` no
				// longer silently drops back to Arial on Hebrew pages.
				sans: ['var(--font-body)'],
				display: ['var(--font-display)'],
				body: ['var(--font-body)'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 10px)',
				'3xl': 'calc(var(--radius) + 18px)',
			},
			fontSize: {
				// Fluid display scale — no jump at the md breakpoint.
				'display-sm': ['clamp(2rem, 1.4rem + 3vw, 3rem)', { lineHeight: '1.08' }],
				'display': ['clamp(2.5rem, 1.6rem + 4.4vw, 4.25rem)', { lineHeight: '1.04' }],
				'display-lg': ['clamp(3rem, 1.8rem + 6vw, 5.5rem)', { lineHeight: '1' }],
			},
			maxWidth: {
				prose: '68ch',
			},
			boxShadow: {
				// Glow, not drop shadow — a dark ground swallows normal shadows.
				glow: '0 0 0 1px hsl(var(--primary) / 0.28), 0 8px 40px -8px hsl(var(--primary) / 0.35)',
				'glow-lg': '0 0 0 1px hsl(var(--primary) / 0.3), 0 16px 70px -12px hsl(var(--primary) / 0.45)',
				panel: '0 1px 0 0 hsl(var(--foreground) / 0.06) inset, 0 20px 50px -24px hsl(215 60% 2% / 0.9)',
				lift: '0 24px 60px -20px hsl(215 60% 2% / 0.95)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0, opacity: 0 },
					to: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
					to: { height: 0, opacity: 0 },
				},
				'fade-up': {
					from: { opacity: 0, transform: 'translateY(12px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-50%)' },
				},
				shimmer: {
					'100%': { transform: 'translateX(100%)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
				'accordion-up': 'accordion-up 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
				'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
				marquee: 'marquee 38s linear infinite',
				shimmer: 'shimmer 2.5s infinite',
			},
			transitionTimingFunction: {
				out: 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
