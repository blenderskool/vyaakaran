import { Token, TokenType, SymbolType } from '../types';
import { isUpperAlpha } from '../utils';

class Lexer {
  private program: string;

  constructor(program: string) {
    this.program = program;
  }

  /**
   * Finds the token type and it's symbolic type
   * @param word String to check
   * @returns Array containing TokenType and SymbolType
   */
  private getTokenType(word: string): [TokenType, SymbolType] {
    switch (word) {
      case '#':
      case 'ε':
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
      case '$':
        return [TokenType.Keyword, SymbolType.Dollar];
    }

    if (!['#', 'ε', 'λ', '->', '|', '.', '//'].some((token) => word.includes(token))) {
      if (isUpperAlpha(word[0])) {
        return [TokenType.Identifier, SymbolType.State];
      }

      return [TokenType.Literal, SymbolType.Literal];
    }

    return [null, null];
  }

  /**
   * Creates a token object from the given line and cursor position
   * 
   * @param line A line from the source
   * @param pos Position of the cursor in the source
   * @returns Token object and new cursor position in the same line
   */
  protected more(line: string, pos: [number, number] = [0, 0]): [Token, number] {
    const [lineIdx, col] = pos;

    let result = '';
    let i = col;

    do {
      result += line[i];
      i++;
    } while(i < line.length && line[i] !== ' ' && this.getTokenType(result + line[i])[0] !== null);

    return [
      {
        value: result,
        type: this.getTokenType(result),
        position: [lineIdx+1, col+1],
      },
      i-1,
    ];
  }


  /**
   * Lexer that generates various tokens from the program.
   * Supports single line comments and line/column numbering
   * @yields A token object
   */
  *lex(): Generator<Token> {
    const lines = this.program.split('\n');
    let lineIdx = 0;

    while(lineIdx < lines.length) {
      const line = lines[lineIdx];

      for(let j=0; j < line.length; j++) {
        if (line[j] === ' ' || line[j] === '') continue;

        const [token, endPos] = this.more(line, [lineIdx, j]);
        // If a comment is encountered, ignore rest of the line
        if (token.type[1] === SymbolType.Comment) {
          break;
        }
        j = endPos;

        yield token;
      }

      lineIdx++;
    }
  }

}

export default Lexer;
