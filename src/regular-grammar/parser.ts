import { SymbolType, Token, ParseTree } from './types';
import Lexer from './lexer';

class Parser {
  program: string;
  parseTable: object;
  /**
   * Parse table for this right linear grammar iteration 2
   */
  static parseTable = {
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

  /**
   * Parses the given program using a parse table
   * @returns an array consiting of productions to derive the program and errors
   */
  parse(): [ParseTree, string] {
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
      } else if (Parser.parseTable[topScope.type] && Parser.parseTable[topScope.type][topToken.type[1]]) {
        const production = Parser.parseTable[topScope.type][topToken.type[1]];

        scope.shift();
        const childNodes = production.split(' ').map((prod) => ({
          type: prod,
          body: [],
        }));
        scope.unshift(...childNodes);
        topScope.body.push(...childNodes);
      } else {
        let error: string;
        if (Parser.parseTable[topScope.type]) {
          const keys = Object.keys(Parser.parseTable[topScope.type]).filter(key => key !== '$');

          if (keys.length === 1) {
            error = `Expected ${keys[0]} at ${topToken.position.join(':')}`;
          } else {
            error = `Expected one of ${keys.join(', ')} at ${topToken.position.join(':')}`;
          }
        } else {
          error = `Expected ${topScope.type} at ${topToken.position.join(':')}`;
        }

        return [null, error];
      }
    }

    return [parseTreeRoot, null];
  }
}

export default Parser;
