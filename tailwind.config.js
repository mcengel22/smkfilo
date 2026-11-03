/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
    './resources/**/*.vue',
],
  theme: {
   extend: {
      maxWidth: {
        "8xl": "83rem",
      },
      width: {
        xl: "42rem", // w-xl sınıfını 36rem olarak tanımladık
      },
    },
  },
  variants: {},
  plugins: [],
}

