/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Vibrant Blue/Teal Palette but with high punch
                'game-primary': '#00C2FF', // Bright Cyan
                'game-secondary': '#7C3AED', // Electric Violet (bringing back some punch but cool tone)
                'game-accent': '#FF2E63', // Neon Red/Pink for hearts/errors

                // Backgrounds
                'game-dark': '#0B1120', // Very dark blue/slate
                'game-surface': '#1F2937', // Lighter slate for cards/inputs
                'game-highlight': '#334155', // Even lighter for hovers

                // Functional
                'safe-success': '#00E096', // Bright Green
                'safe-warning': '#FFAA00', // Bright Orange
            },
            animation: {
                'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                pop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
