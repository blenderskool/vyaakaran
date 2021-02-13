import { SymbolType, Token, ParseTree, CompileError } from './types';
import Lexer from './lexer';

class Parser {
  private program: string;
  /**
   * Parse table for this right linear grammar iteration 2
   */
  protected static readonly parseTable = {
    'Statement': {
      [SymbolType.State]: `${SymbolType.State} ${SymbolType.Follow} Symbol Expression Statement`,
      '$': `EPSILON`,
    },
    'Expression': {
      [SymbolType.State]: `EPSILON`,
      [SymbolType.Or]: `${SymbolType.Or} Symbol Expression`,
      '$': `EPSILON`,
    },
    'Term': {
      [SymbolType.State]: `${SymbolType.State}`,
      [SymbolType.Literal]: `${SymbolType.Literal} NextTerm`,
    },
    'Symbol': {
      [SymbolType.State]: `Term`,
      [SymbolType.Literal]: `Term`,
      [SymbolType.Empty]: `${SymbolType.Empty}`,
    },
    'NextTerm': {
      [SymbolType.State]: `EPSILON`,
      [SymbolType.Or]: `EPSILON`,
      [SymbolType.Dot]: `${SymbolType.Dot} Term`,
      '$': `EPSILON`,
    },
  };

  constructor(program: string) {
    this.program = program;
  }

  protected createError(topScope): CompileError {
    const parseTable = (this.constructor as any).parseTable;
    const error: CompileError = { type: 'Error', message: '' };

    if (parseTable[topScope.type]) {
      const keys = Object.keys(parseTable[topScope.type]).filter(key => key !== '$');

      if (keys.length === 1) {
        error.message = `Expected ${keys[0]}`;
      } else {
        error.message = `Expected one of ${keys.join(', ')}`;
      }
    } else {
      error.message = `Expected ${topScope.type}`;
    }

    return error;
  }

  /**
   * Parses the given program using a parse table
   * @returns an array consiting of parse tree and errors
   */
  parse(): [ParseTree, CompileError] {
    const parseTable = (this.constructor as any).parseTable;
    const parseTreeRoot = { type: 'Statement', body: [] };
    const scope = [ parseTreeRoot ];
    const tokenStream = new Lexer(this.program).lex();
    let token = tokenStream.next();
    
    while(!token.done && scope.length) {
      const topToken: Token = token.value;
      const topScope = scope[0];

      if (topScope.type === 'EPSILON') {
        scope.shift();
      } else if (topToken.type[1] === topScope.type) {
        topScope.body.push(topToken);
        // Stream next token as the current token was successfully matched
        token = tokenStream.next();
        scope.shift();
      } else if (parseTable[topScope.type] && parseTable[topScope.type][topToken.type[1]]) {
        const production = parseTable[topScope.type][topToken.type[1]];

        scope.shift();
        const childNodes = production.split(' ').map((prod) => ({
          type: prod,
          body: [],
        }));
        scope.unshift(...childNodes);
        topScope.body.push(...childNodes);
      } else {
        const error = this.createError(topScope);
        error.message += ` at ${topToken.position.join(':')}`;

        return [null, error];
      }
    }

    while(scope.length) {
      const topScope = scope[0];
      const toTerminal = parseTable[topScope.type];
      if (toTerminal?.['$'] === `EPSILON`) {
        scope.shift();
        continue;
      }

      const error = this.createError(topScope);
      error.message += ` at the end of program`;

      return [null, error];
    }

    return [parseTreeRoot, null];
  }
}

export default Parser;
