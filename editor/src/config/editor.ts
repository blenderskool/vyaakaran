import * as monaco from 'monaco-editor';

monaco.languages.register({ id: 'Vyaakaran Regular Grammar' });
monaco.languages.setMonarchTokensProvider('Vyaakaran Regular Grammar', {
  tokenizer: {
    root: [
      [/(->)|\||-/, 'operator'],
      [/[#ελ]/, 'keyword'],
      [/\./, 'separator'],
      [/\/\/.*/, 'comment'],
      [/([A-Z][^\.#ελ\/ \-|]*)/, 'non-terminal', ],
      [/([^A-Z\.#ελ\/ \-|][^\.#ελ\/ \-|]*)/, 'terminal', ],
    ],
  },
});

monaco.editor.defineTheme('vyaakaran', {
  base: 'vs-dark',
  inherit: false,
  rules: [
    { token: 'terminal', foreground: '#34febb', fontStyle: 'italic' },
    { token: 'operator', foreground: '#5d8cc0' },
    { token: 'comment', foreground: '#586f89' },
    { token: 'keyword', foreground: '#32ae85', fontStyle: 'bold' },
    { token: 'separator', foreground: '#586f89' },
    { token: 'source', foreground: '#d6e9ff' },
    { token: 'non-terminal', foreground: '#d6e9ff' },
  ],
  colors: {},
});

const editorConfig = {
  theme: 'vyaakaran',
  fontLigatures: true,
  fontFamily: 'Fira Code',
  fontWeight: '500',
  minimap: {
    enabled: false,
  },
};

export { editorConfig };
