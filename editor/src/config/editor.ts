import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/editor/contrib/find/findController';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor';
import { PlaygroundType } from '../store/code';

monaco.languages.register({ id: 'Vyaakaran Grammar' });
monaco.languages.setMonarchTokensProvider('Vyaakaran Grammar', {
  tokenizer: {
    root: [
      [/(->)|\||-/, 'operator'],
      [/[#ελ$]/, 'keyword'],
      [/\./, 'separator'],
      [/\/\/.*/, 'comment'],
      [/([A-Z][^\.#$ελ\/ \-|]*)/, 'non-terminal'],
      [/([^A-Z\.#$ελ\/ \-|][^\.#$ελ\/ \-|]*)/, 'terminal'],
    ],
  },
});

monaco.languages.register({ id: 'Vyaakaran State Transition' });
monaco.languages.setMonarchTokensProvider('Vyaakaran State Transition', {
  tokenizer: {
    root: [
      [/#/, 'keyword'],
      [/[A-Z]\w*/, 'state'],
      [/[a-z0-9]/, 'symbol'],
      [/-/, 'hyphen'],
      [/[<>=]/, 'direction'],
      [/[\(\):]/, 'seperator'],
      [/\/\/.*/, 'comment'],
    ],
  },
});

monaco.editor.defineTheme('vyaakaran-grammar', {
  base: 'vs-dark',
  inherit: false,
  rules: [
    { token: 'terminal', foreground: '#67E8F9', fontStyle: 'italic' },
    { token: 'operator', foreground: '#64748B' },
    { token: 'comment', foreground: '#475569' },
    { token: 'keyword', foreground: '#0891B2', fontStyle: 'bold' },
    { token: 'separator', foreground: '#475569' },
    { token: 'source', foreground: '#d6e9ff' },
    { token: 'non-terminal', foreground: '#d6e9ff' },
  ],
  colors: {
    'editorLineNumber.foreground': '#444c55',
    'editor.background': '#18181B',
    'editor.selectionBackground': '#ffffff20',
  },
});

monaco.editor.defineTheme('vyaakaran-state-transition', {
  base: 'vs-dark',
  inherit: false,
  rules: [
    { token: 'keyword', foreground: '#0891B2', fontStyle: 'bold' },
    { token: 'state', foreground: '#d9e9ff' },
    { token: 'source', foreground: '#d6e9ff' },
    { token: 'symbol', foreground: '#67E8F9' },
    { token: 'hyphen', foreground: '#64748B' },
    { token: 'direction', foreground: '#67E8F9' },
    { token: 'seperator', foreground: '#64748B' },
    { token: 'comment', foreground: '#475569' },
  ],
  colors: {
    'editorLineNumber.foreground': '#444c55',
    'editor.background': '#18181B',
    'editor.selectionBackground': '#ffffff20',
  },
});

const getEditorConfig = (playgroundType: PlaygroundType): monaco.editor.IStandaloneEditorConstructionOptions => ({
  theme: playgroundType === 'TM' ? 'vyaakaran-state-transition' : 'vyaakaran-grammar',
  language: playgroundType === 'TM' ? 'Vyaakaran State Transition' : 'Vyaakaran Grammar',
  fontLigatures: true,
  fontFamily: 'Fira Code, monospace',
  fontWeight: '500',
  renderWhitespace: 'none',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
  },
  lightbulb: {
    enabled: false,
  },
  folding: false,
  lineNumbersMinChars: 4,
  lineDecorationsWidth: 20,
  automaticLayout: true,
  mouseWheelZoom: true,
});

export { getEditorConfig };
