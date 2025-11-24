/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1e3a8a', // Dark Blue
                secondary: '#64748b', // Slate
                accent: '#0ea5e9', // Sky Blue
                danger: '#ef4444', // Red
                success: '#22c55e', // Green
            }
        },
    },
    plugins: [],
}
