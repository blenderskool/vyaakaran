enum TokenType {
  Literal = 'LITERAL',
  Identifier = 'IDENTIFER',
  Keyword = 'KEYWORD',
  Separator = 'SEPARATOR',
  Comment = 'COMMENT',
};

enum SymbolType {
  Follow = '->',
  Empty = '#',
  Or = '|',
  Literal = 'TERMINAL',
  State = 'NON_TERMINAL',
  Dot = '.',
  Comment = 'COMMENT',
};

interface Token {
  type: [TokenType, SymbolType];
  value: string;
  position: [number, number];
};

export { TokenType, Token, SymbolType };
