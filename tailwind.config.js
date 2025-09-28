/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fffbf5",
          100: "#fff8e6",
          200: "#fff6ea",
          300: "#fff2d9",
          400: "#ffecc7",
          500: "#ffe6b5",
        },
        terminal: {
          black: "#000000",
          "dark-gray": "#1a1a1a",
          "med-gray": "#4a4a4a",
          "light-gray": "#9ea3a6",
          white: "#ffffff",
        },
        accent: {
          green: "#7bc47f",
          "green-hover": "#6ab36e",
          yellow: "#ffd166",
          "yellow-hover": "#e6bc5a",
          orange: "#ff9f1c",
          "orange-hover": "#e68f19",
          blue: "#4a90e2",
          "blue-hover": "#357abd",
          red: "#e74c3c",
          "red-hover": "#c0392b",
        },
        status: {
          online: "#2ecc71",
          away: "#f39c12",
          busy: "#e74c3c",
          offline: "#95a5a6",
        },
        message: {
          sent: "#e8f5e8",
          received: "#f8f9fa",
          system: "#fff3cd",
        },
      },
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Space Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
