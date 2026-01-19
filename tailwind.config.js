/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Warm Family Palette
                'game-bg': '#FFFBF5', // Cream / Off-white (Background)
                'game-text': '#422006', // Dark Brown (Main Text)
                'game-primary': '#FF8E3C', // Warm Orange (Primary Buttons/Highlights)
                'game-secondary': '#8B5CF6', // Violet/Purple (Team 2 / Accents)
                'game-accent': '#FF6B6B', // Soft Red (Action/Hearts)
                'game-safe': '#6BCB77', // Soft Green (Success)
                'game-card': '#FFFFFF', // Pure White (Cards)
                'game-subtle': '#F2E8DC', // Beige/Sand (Subtle backgrounds)
                'game-dark': '#2D2D2D', // Keep for compatibility if needed, or specific dark elements
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
