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
 * Finds the token type and it's symbolic type
 * @param word String to check
 * @returns Array containing TokenType and SymbolType
 */
function getTokenType(word: string): [TokenType, SymbolType] {
  switch (word) {
    case '#':
    case 'ϵ':
    case 'λ':
      return [TokenType.Keyword, SymbolType.Empty];
    case '->':
      return [TokenType.Operator, SymbolType.Follow];
    case '|':
      return [TokenType.Operator, SymbolType.Or];
    case '.':
      return [TokenType.Separator, SymbolType.Dot];
    case '//':
      return [TokenType.Comment, SymbolType.Comment];
  }

  if (isUpperAlpha(word[0])) {
    return [TokenType.Identifier, SymbolType.State];
  }

  return [TokenType.Literal, SymbolType.Literal];
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

  let i = col + 1;
  while(i < line.length && line[i] !== ' ' && getTokenType(result)[0] === TokenType.Literal) {
    result += line[i];
    i++;
  }

  return [
    {
      value: result,
      type: getTokenType(result),
      position: [lineIdx+1, col+1],
    },
    i-1
  ];
}

export { isUpperAlpha, more };
