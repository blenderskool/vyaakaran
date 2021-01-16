import { SymbolType, Token, TokenType } from './types';

/**
 * Checkes whether the first character in the parameter
 * is an upper case alphabet
 * @param char Character to check
 */
function isUpperAlpha(char: string) {
  const charCode = char.charCodeAt(0);

  return charCode >= 65 && charCode <= 90;
}

/**
 * Returns the type of the token from the character
 * @param char Character to check
 */
function getTokenType(char: string): TokenType {
  if (char === '#') {
    return TokenType.Keyword;
  } else if (new Set([ '-', '>', '|', '.' ]).has(char)) {
    return TokenType.Separator;
  } else if (char === '/') {
    return TokenType.Comment;
  } else if (isUpperAlpha(char)) {
    return TokenType.Identifier;
  }
  
  return TokenType.Literal;
}

/**
 * Returns the type of the symbol from the token
 * @param token Token to check
 */
function getSymbolType(token: string): SymbolType {
  switch (token) {
    case '#':
      return SymbolType.Empty;
    case '->':
      return SymbolType.Follow;
    case '|':
      return SymbolType.Or;
    case '.':
      return SymbolType.Dot;
    case '//':
      return SymbolType.Comment;
  };

  const tokenType = getTokenType(token[0]);
  switch (tokenType) {
    case TokenType.Identifier:
      return SymbolType.State;
    case TokenType.Literal:
      return SymbolType.Literal;
  };
}

/**
 * Creates a token object from the given line and cursor position
 * 
 * @param line A line from the source
 * @param pos Position of the cursor in the source
 * @returns Token object and new cursor position in the same line
 */
function more(line: string, pos: [number, number] = [0, 0]): [Token, number] {
  const [lineIdx, col] = pos;

  let result = line[col];
  const tokenType = getTokenType(result);

  let i = col + 1;
  while(i < line.length && getTokenType(line[i]) === tokenType && line[i] !== ' ') {
    result += line[i];
    i++;
  }

  return [
    {
      value: result,
      type: [tokenType, getSymbolType(result)],
      position: [lineIdx, col],
    },
    i-1
  ];
}

export { isUpperAlpha, more };
