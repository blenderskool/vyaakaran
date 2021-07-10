import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors';
import typography from 'windicss/plugin/typography';
import defaultTheme from 'windicss/defaultTheme';

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: '"Inter", sans-serif',
        fira: '"Fira Code", monospace',
      },
      boxShadow: {
        '3xl': '0 34px 65px #02091c, 0 3px 2px rgb(0 0 0 / 7%), 0 7px 5px rgb(0 0 0 / 4%), 0 13px 10px rgb(0 0 0 / 3%), 0 22px 18px rgb(0 0 0 / 3%), 0 42px 33px rgb(0 0 0 / 2%), 0 100px 80px rgb(0 0 0 / 2%)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              color: colors.blueGray[200],
              fontWeight: 'bold',
              fontSize: theme('fontSize.4xl')
            },
            h2: {
              color: colors.blueGray[200],
              fontWeight: '600',
              fontSize: theme('fontSize.2xl'),
              marginTop: theme('spacing.12')
            },
            h3: {
              color: colors.blueGray[200],
              fontSize: theme('fontSize.xl'),
              marginTop: theme('spacing.8'),
              fontWeight: '500',
            },
            p: {
              marginTop: theme('spacing.6'),
              lineHeight: theme('lineHeight.7'),
            },
            a: {
              color: colors.cyan[300],
              '&:hover': {
                textDecoration: 'underline',
              }
            },
            strong: {
              color: colors.blueGray[200],
            },
            code: {
              color: colors.cyan[600],
              backticks: false,
              fontFamily: '"Fira Code", monospace',
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            pre: {
              backgroundColor: colors.blueGray[800],
              whiteSpace: 'pre-line',
              marginTop: theme('spacing.6'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.md'),
              boxShadow: defaultTheme.boxShadow.xl,
            },
            ul: {
              listStyle: 'disc',
              marginLeft: theme('spacing.4'),
              marginTop: theme('spacing.6'),
              lineHeight: theme('lineHeight.7'),
              '*': {
                marginTop: theme('spacing.4'),
              }
            },
          }
        }
      }),
    },
  },
  plugins: [
    typography
  ]
});
