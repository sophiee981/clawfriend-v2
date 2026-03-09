/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["[data-theme='dark']"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        neutral: {
          "01": "var(--bg-neutral-01)",
          "02": "var(--bg-neutral-02)",
          "03": "var(--bg-neutral-03)",
          "04": "var(--bg-neutral-04)",
          inverse: "var(--bg-neutral-inverse)",
          500: "var(--neutral-500)",
        },
        modal: {
          DEFAULT: "var(--bg-modal)",
        },
        card: {
          DEFAULT: "var(--overlay-light-5)",
        },
        primary: {
          DEFAULT: "var(--bg-primary)",
          "muted-20": "var(--bg-primary-muted-20)",
          "muted-10": "var(--bg-primary-muted-10)",
          "muted-5": "var(--bg-primary-muted-5)",
        },
        secondary: {
          DEFAULT: "var(--bg-secondary)",
          "muted-20": "var(--bg-secondary-muted-20)",
          "muted-10": "var(--bg-secondary-muted-10)",
        },
        success: {
          DEFAULT: "var(--bg-success)",
          "muted-20": "var(--bg-success-muted-20)",
          "muted-10": "var(--bg-success-muted-10)",
        },
        danger: {
          DEFAULT: "var(--bg-danger)",
          "muted-20": "var(--bg-danger-muted-20)",
          "muted-10": "var(--bg-danger-muted-10)",
        },
        warning: {
          DEFAULT: "var(--bg-warning)",
          "muted-20": "var(--bg-warning-muted-20)",
          "muted-10": "var(--bg-warning-muted-10)",
        },
        info: {
          DEFAULT: "var(--bg-info)",
          "muted-20": "var(--bg-info-muted-20)",
          "muted-10": "var(--bg-info-muted-10)",
        },
        overlay: {
          light: {
            100: "var(--overlay-light-100)",
            90: "var(--overlay-light-90)",
            80: "var(--overlay-light-80)",
            70: "var(--overlay-light-70)",
            60: "var(--overlay-light-60)",
            50: "var(--overlay-light-50)",
            40: "var(--overlay-light-40)",
            30: "var(--overlay-light-30)",
            20: "var(--overlay-light-20)",
            10: "var(--overlay-light-10)",
            5: "var(--overlay-light-5)",
          },
          dark: {
            100: "var(--overlay-dark-100)",
            90: "var(--overlay-dark-90)",
            80: "var(--overlay-dark-80)",
            70: "var(--overlay-dark-70)",
            60: "var(--overlay-dark-60)",
            50: "var(--overlay-dark-50)",
            40: "var(--overlay-dark-40)",
            30: "var(--overlay-dark-30)",
            20: "var(--overlay-dark-20)",
            10: "var(--overlay-dark-10)",
            5: "var(--overlay-dark-5)",
          },
        },
        yellow: {
          DEFAULT: "var(--custom-yellow-500)",
          muted: "var(--custom-yellow-500\\:20)",
          5: "var(--custom-yellow-500\\:5)",
        },
        lime: {
          DEFAULT: "var(--custom-lime-500)",
          muted: "var(--custom-lime-500\\:20)",
        },
        teal: {
          DEFAULT: "var(--custom-teal-500)",
          muted: "var(--custom-teal-500\\:20)",
        },
        indigo: {
          DEFAULT: "var(--custom-indigo-500)",
          muted: "var(--custom-indigo-500\\:20)",
          5: "var(--custom-indigo-500\\:5)",
        },
        pink: {
          DEFAULT: "var(--custom-pink-500)",
          muted: "var(--custom-pink-500\\:20)",
          5: "var(--custom-pink-500\\:5)",
        },
      },

      borderColor: {
        neutral: {
          "01": "var(--border-neutral-01)",
          "02": "var(--border-neutral-02)",
          "03": "var(--border-neutral-03)",
          "04": "var(--border-neutral-04)",
          inverse: "var(--border-neutral-inverse)",
        },
        primary: {
          DEFAULT: "var(--border-primary)",
          muted: "var(--border-primary-muted)",
        },
        secondary: {
          DEFAULT: "var(--border-secondary)",
          muted: "var(--border-secondary-muted)",
        },
        success: {
          DEFAULT: "var(--border-success)",
          muted: "var(--border-success-muted)",
        },
        danger: {
          DEFAULT: "var(--border-danger)",
          muted: "var(--border-danger-muted)",
        },
        warning: {
          DEFAULT: "var(--border-warning)",
          muted: "var(--border-warning-muted)",
        },
        info: {
          DEFAULT: "var(--border-info)",
          muted: "var(--border-info-muted)",
        },
        yellow: {
          DEFAULT: "var(--border-yellow)",
          muted: "var(--border-yellow-muted)",
          10: "var(--custom-yellow-500\\:10)",
        },
        lime: {
          DEFAULT: "var(--border-lime)",
          muted: "var(--border-lime-muted)",
          10: "var(--custom-lime-500\\:10)",
        },
        teal: {
          DEFAULT: "var(--border-teal)",
          muted: "var(--border-teal-muted)",
          10: "var(--custom-teal-500\\:10)",
        },
        indigo: {
          DEFAULT: "var(--border-indigo)",
          muted: "var(--border-indigo-muted)",
          10: "var(--custom-indigo-500\\:10)",
        },
        pink: {
          DEFAULT: "var(--border-pink)",
          muted: "var(--border-pink-muted)",
          10: "var(--custom-pink-500\\:10)",
        },
        overlay: {
          DEFAULT: "var(--overlay-dark-10)",
          light: "var(--overlay-light-10)",
          dark: "var(--overlay-dark-10)",
        },
      },

      textColor: {
        neutral: {
          primary: "var(--text-neutral-primary)",
          secondary: "var(--text-neutral-secondary)",
          tertiary: "var(--text-neutral-tertiary)",
          "on-color": "var(--text-neutral-on-color)",
          inverse: "var(--text-neutral-inverse)",
        },
        primary: {
          DEFAULT: "var(--text-primary)",
          lightness: "var(--text-primary-lightness)",
          darkness: "var(--text-primary-darkness)",
        },
        success: {
          DEFAULT: "var(--text-success)",
          lightness: "var(--text-success-lightness)",
          darkness: "var(--text-success-darkness)",
        },
        danger: {
          DEFAULT: "var(--text-danger)",
          lightness: "var(--text-danger-lightness)",
          darkness: "var(--text-danger-darkness)",
        },
        warning: {
          DEFAULT: "var(--text-warning)",
          lightness: "var(--text-warning-lightness)",
          darkness: "var(--text-warning-darkness)",
        },
        info: {
          DEFAULT: "var(--text-info)",
          lightness: "var(--text-info-lightness)",
          darkness: "var(--text-info-darkness)",
        },
        overlay: {
          light: "var(--overlay-light-80)",
          dark: "var(--overlay-dark-80)",
        },
        yellow: "var(--text-yellow)",
        lime: "var(--text-lime)",
        teal: "var(--text-teal)",
        indigo: "var(--text-indigo)",
        pink: "var(--text-pink)",
      },

      fontSize: {
        sm: "13px",
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "display-md": [
          "36px",
          {
            lineHeight: "44px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "heading-lg": [
          "28px",
          {
            lineHeight: "36px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "heading-md": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "heading-sm": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],

        "label-lg": [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-md": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-sm": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-xs": [
          "13px",
          {
            lineHeight: "16px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-2xs": [
          "12px",
          {
            lineHeight: "12px",
            fontWeight: "500",
            letterSpacing: "0px",
            textTransform: "uppercase",
          },
        ],
        "label-3xs": [
          "11px",
          {
            lineHeight: "12px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-3xs-uc": [
          "10px",
          {
            lineHeight: "12px",
            fontWeight: "500",
            letterSpacing: "0px",
            textTransform: "uppercase",
          },
        ],

        "body-lg": [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-md": [
          "16px",
          {
            lineHeight: "24px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-sm": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-xs": [
          "13px",
          {
            lineHeight: "16px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-2xs": [
          "12px",
          {
            lineHeight: "12px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-3xs": [
          "11px",
          {
            lineHeight: "12px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
      },
      fontFamily: {
        geist: ["var(--font-geist)", "sans-serif"],
        spaceMono: ["var(--font-space-mono)", "monospace"],
        jetBrainsMono: ["var(--font-jetBrainsMono)", "monospace"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "display-md": [
          "36px",
          {
            lineHeight: "44px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "heading-lg": [
          "28px",
          {
            lineHeight: "36px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "heading-md": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "heading-sm": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],

        "label-lg": [
          "16px",
          {
            lineHeight: "28px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-md": [
          "14px",
          {
            lineHeight: "24px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-sm": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-xs": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "500",
            letterSpacing: "0px",
          },
        ],
        "label-2xs": [
          "10px",
          {
            lineHeight: "12px",
            fontWeight: "500",
            letterSpacing: "0px",
            textTransform: "uppercase",
          },
        ],

        "body-lg": [
          "16px",
          {
            lineHeight: "28px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-md": [
          "14px",
          {
            lineHeight: "24px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-sm": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
        "body-xs": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "400",
            letterSpacing: "0px",
          },
        ],
      },
      colors: {
        // Neutral colors
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
          "500:10": "var(--neutral-500\\:10)",
          "500:20": "var(--neutral-500\\:20)",
        },

        // Semantic colors
        primary: {
          300: "var(--semantic-primary-300)",
          400: "var(--semantic-primary-400)",
          500: "var(--semantic-primary-500)",
          600: "var(--semantic-primary-600)",
          700: "var(--semantic-primary-700)",
          DEFAULT: "var(--semantic-primary-500)",
          "500:5": "var(--semantic-primary-500\\:5)",
          "500:10": "var(--semantic-primary-500\\:10)",
          "500:20": "var(--semantic-primary-500\\:20)",
        },

        // Success colors
        success: {
          300: "var(--semantic-success-300)",
          400: "var(--semantic-success-400)",
          500: "var(--semantic-success-500)",
          600: "var(--semantic-success-600)",
          700: "var(--semantic-success-700)",
          DEFAULT: "var(--semantic-success-500)",
          "500:10": "var(--semantic-success-500\\:10)",
          "500:20": "var(--semantic-success-500\\:20)",
        },

        // Danger colors
        danger: {
          300: "var(--semantic-danger-300)",
          400: "var(--semantic-danger-400)",
          500: "var(--semantic-danger-500)",
          600: "var(--semantic-danger-600)",
          700: "var(--semantic-danger-700)",
          DEFAULT: "var(--semantic-danger-500)",
          "500:10": "var(--semantic-danger-500\\:10)",
          "500:20": "var(--semantic-danger-500\\:20)",
        },

        // Warning colors
        warning: {
          300: "var(--semantic-warning-300)",
          400: "var(--semantic-warning-400)",
          500: "var(--semantic-warning-500)",
          600: "var(--semantic-warning-600)",
          700: "var(--semantic-warning-700)",
          DEFAULT: "var(--semantic-warning-500)",
          "500:10": "var(--semantic-warning-500\\:10)",
          "500:20": "var(--semantic-warning-500\\:20)",
        },

        // Info colors
        info: {
          300: "var(--semantic-info-300)",
          400: "var(--semantic-info-400)",
          500: "var(--semantic-info-500)",
          600: "var(--semantic-info-600)",
          700: "var(--semantic-info-700)",
          DEFAULT: "var(--semantic-info-500)",
          "500:10": "var(--semantic-info-500\\:10)",
          "500:20": "var(--semantic-info-500\\:20)",
        },

        // Social colors
        social: {
          facebook: "var(--social-brand-facebook)",
          twitter: "var(--social-brand-twitter)",
          linkedin: "var(--social-brand-linkedin)",
          instagram: "var(--social-brand-instagram)",
          youtube: "var(--social-brand-youtube)",
          "tiktok-pink": "var(--social-brand-tiktok-pink)",
          discord: "var(--social-brand-discord)",
          telegram: "var(--social-brand-telegram)",
          reddit: "var(--social-brand-reddit)",
          snapchat: "var(--social-brand-snapchat)",
          whatsapp: "var(--social-brand-whatsapp)",
          pinterest: "var(--social-brand-pinterest)",
          twitch: "var(--social-brand-twitch)",
          medium: "var(--social-brand-medium)",
        },

        // Overlay colors
        overlay: {
          light: {
            100: "var(--overlay-light-100)",
            90: "var(--overlay-light-90)",
            80: "var(--overlay-light-80)",
            70: "var(--overlay-light-70)",
            60: "var(--overlay-light-60)",
            50: "var(--overlay-light-50)",
            40: "var(--overlay-light-40)",
            30: "var(--overlay-light-30)",
            20: "var(--overlay-light-20)",
            10: "var(--overlay-light-10)",
            5: "var(--overlay-light-5)",
          },
          dark: {
            100: "var(--overlay-dark-100)",
            90: "var(--overlay-dark-90)",
            80: "var(--overlay-dark-80)",
            70: "var(--overlay-dark-70)",
            60: "var(--overlay-dark-60)",
            50: "var(--overlay-dark-50)",
            40: "var(--overlay-dark-40)",
            30: "var(--overlay-dark-30)",
            20: "var(--overlay-dark-20)",
            10: "var(--overlay-dark-10)",
            5: "var(--overlay-dark-5)",
          },
        },

        // Custom colors
        lime: {
          400: "var(--custom-lime-400)",
          500: "var(--custom-lime-500)",
          600: "var(--custom-lime-600)",
          DEFAULT: "var(--custom-lime-500)",
          "500:10": "var(--custom-lime-500\\:10)",
          "500:20": "var(--custom-lime-500\\:20)",
        },

        teal: {
          200: "var(--custom-teal-200)",
          400: "var(--custom-teal-400)",
          500: "var(--custom-teal-500)",
          600: "var(--custom-teal-600)",
          DEFAULT: "var(--custom-teal-500)",
          "500:10": "var(--custom-teal-500\\:10)",
          "500:20": "var(--custom-teal-500\\:20)",
        },

        indigo: {
          400: "var(--custom-indigo-400)",
          500: "var(--custom-indigo-500)",
          600: "var(--custom-indigo-600)",
          DEFAULT: "var(--custom-indigo-500)",
          "500:5": "var(--custom-indigo-500\\:5)",
          "500:10": "var(--custom-indigo-500\\:10)",
          "500:20": "var(--custom-indigo-500\\:20)",
        },

        pink: {
          400: "var(--custom-pink-400)",
          500: "var(--custom-pink-500)",
          600: "var(--custom-pink-600)",
          DEFAULT: "var(--custom-pink-500)",
          "500:5": "var(--custom-pink-500\\:5)",
          "500:10": "var(--custom-pink-500\\:10)",
          "500:20": "var(--custom-pink-500\\:20)",
        },

        yellow: {
          400: "var(--custom-yellow-400)",
          500: "var(--custom-yellow-500)",
          600: "var(--custom-yellow-600)",
          DEFAULT: "var(--custom-yellow-500)",
          "500:5": "var(--custom-yellow-500\\:5)",
          "500:10": "var(--custom-yellow-500\\:10)",
          "500:20": "var(--custom-yellow-500\\:20)",
        },

        // Basic colors for backward compatibility
        blue: "var(--blue)",
        cyan: "var(--cyan)",
        green: "var(--green)",
        orange: "var(--orange)",
        red: "var(--red)",
      },
      keyframes: {
        slideUp: {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideHorizontal: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        grid: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(4rem)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
          },
          "50%": {
            transform: "translateY(-20px) translateX(10px)",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(40px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-40px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-40px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(40px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(254, 86, 49, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(254, 86, 49, 0.8)",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            backgroundPosition: "50% 0%",
          },
          "50%": {
            backgroundPosition: "50% 100%",
          },
        },
        tilt: {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(1deg)",
          },
          "75%": {
            transform: "rotate(-1deg)",
          },
        },
        "slide-in-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "bounce-subtle": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
      },
      animation: {
        slideUp: "slideUp 0.2s ease-out",
        slideHorizontal: "slideHorizontal 0.2s ease-out",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
        fadeInDown: "fadeInDown 0.6s ease-out forwards",
        fadeInLeft: "fadeInLeft 0.6s ease-out forwards",
        fadeInRight: "fadeInRight 0.6s ease-out forwards",
        scaleIn: "scaleIn 0.5s ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "gradient-y": "gradient-y 3s ease infinite",
        tilt: "tilt 10s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.6s ease-out forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        ripple: "ripple 0.6s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/typography"),
  ],
};
