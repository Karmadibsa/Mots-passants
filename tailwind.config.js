/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'game-primary': '#0EA5E9', // Sky Blue
                'game-secondary': '#6366F1', // Indigo
                'game-accent': '#F43F5E', // Rose (for popping elements)
                'game-dark': '#0F172A', // Slate 900
                'game-surface': '#1E293B', // Slate 800
                'safe-success': '#10B981', // Emerald
                'safe-warning': '#F59E0B', // Amber
            },
            animation: {
                'pop': 'pop 0.3s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
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
