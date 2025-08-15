/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: { 
    extend: {
      colors: {
        background: "#F5F5F5",
        primary: {
          DEFAULT: "#EDE3CF",
        },
        secondary: {
          DEFAULT: "#1c2c4c",
          light: "#1b3d6e",
          transparent:"#1b3d6e1A"
        },
        discountRed: '#ff0202',
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontSize: {
        xx: "10px",
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        xxl: "24px",
        xxxl: "30px",
        body: "13px", 
      },
      fontFamily: {
        "iran-yekan": ["var(--font-iran-yekan)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      screens: {
        phone: "480px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px",
      },
  } 
},
  plugins: [],
}
