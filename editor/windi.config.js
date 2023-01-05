import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors';

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: '"Inter", sans-serif',
        fira: '"Fira Code", monospace',
		merri: '"Merriweather", serif',
      },
      fontSize: {
        xxs: '0.625rem',
      },
      colors: {
        gray: {
          ...colors.gray,
          850: '#212023',
        },
        'steel-blue': {
          100: '#d6e9ff',
          400: '#88b4e7',
          500: '#64748B',
        },
      },
      boxShadow: {
        '3xl': '0 34px 65px #02091c, 0 3px 2px rgb(0 0 0 / 7%), 0 7px 5px rgb(0 0 0 / 4%), 0 13px 10px rgb(0 0 0 / 3%), 0 22px 18px rgb(0 0 0 / 3%), 0 42px 33px rgb(0 0 0 / 2%), 0 100px 80px rgb(0 0 0 / 2%)',
      },
    },
  },
});
