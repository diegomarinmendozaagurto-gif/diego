/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        sidebar: "rgb(var(--color-sidebar) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        electric: "rgb(var(--color-electric) / <alpha-value>)",
        network: "rgb(var(--color-network) / <alpha-value>)",
        security: "rgb(var(--color-security) / <alpha-value>)",
        cost: "rgb(var(--color-cost) / <alpha-value>)",
        alert: "rgb(var(--color-alert) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        light: {
          background: "#F8FAFC",
          sidebar: "#0F172A",
          primary: "#2563EB",
          security: "#16A34A",
          cost: "#F59E0B",
          alert: "#DC2626",
          "text-primary": "#1E293B",
          "text-secondary": "#64748B",
          border: "#E2E8F0",
          card: "#FFFFFF",
        },
        hud: {
          background: "#050B14",
          cyan: "#22D3EE",
          electric: "#3B82F6",
          card: "#0B1622",
          border: "#1E3A52",
        },
      },
      borderRadius: {
        card: "14px",
        panel: "10px",
        hud: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08)",
        hud: "0 0 20px rgba(34, 211, 238, 0.15)",
        "hud-active":
          "0 0 0 1px rgba(34, 211, 238, 0.28), 0 0 20px rgba(34, 211, 238, 0.15)",
      },
    },
  },
  plugins: [],
};
