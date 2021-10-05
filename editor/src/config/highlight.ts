import hljs from 'highlight.js/lib/core';

hljs.registerLanguage('vyaakaran grammar', () => ({
  name: 'Vyaakaran Grammar',
  keywords: '# ε λ $',
  contains: [
    {
      className: 'keyword',
      match: /[#ελ$]/,
    },
    {
      className: 'non-terminal',
      match: /([A-Z][^\.#$ελ\/ \-|]*)/,
    },
    {
      className: 'terminal',
      match: /([^A-Z\.#$ελ\/ \-|][^\.#$ελ\/ \-|]*)/,
    },
    {
      className: 'operator',
      match: /(->)|\||-/,
    },
    {
      className: 'separator',
      match: /\./,
    },
    {
      className: 'comment', 
      match: /\/\/.*/,
    },
  ],
}));

export { hljs };
