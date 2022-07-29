import hljs from 'highlight.js/lib/core.js';

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

hljs.registerLanguage('State Transition Grammar', () => ({
  name:'State Transition Grammar',
  contains: [
    {
      className: 'keyword',
      match: /#/,
    },
    {
      className: 'state',
      match: /[A-Z]\w./,
    },
    {
      className: 'symbol',
      match: /[0-9a-z]/,
    },
    {
      className: 'hyphen',
      match: /-/,
    },
    {
      className: 'direction',
      match: /[><=]/,
    },
    {
      className: 'seperator',
      match: /[\(\):]/, 
    },
    {
      className: 'comment', 
      match: /\/\/.*/,
    },
  ],
}));

export { hljs };
