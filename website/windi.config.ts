import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: '"Inter", sans-serif',
        fira: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        '3xl': '0 34px 65px #02091c, 0 3px 2px rgb(0 0 0 / 7%), 0 7px 5px rgb(0 0 0 / 4%), 0 13px 10px rgb(0 0 0 / 3%), 0 22px 18px rgb(0 0 0 / 3%), 0 42px 33px rgb(0 0 0 / 2%), 0 100px 80px rgb(0 0 0 / 2%)',
      },
    },
  },
});
