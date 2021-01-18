enum TokenType {
  Literal = 'LITERAL',
  Identifier = 'IDENTIFER',
  Keyword = 'KEYWORD',
  Separator = 'SEPARATOR',
  Comment = 'COMMENT',
  Operator = 'OPERATOR',
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

interface ParseTree {
  type: string;
  body: (ParseTree|Token)[];
};

export { TokenType, Token, SymbolType, ParseTree };
