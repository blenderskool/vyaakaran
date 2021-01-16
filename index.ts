import { more } from "./utils";
import { Token, SymbolType } from "./types";
import { readFile } from "fs";

/**
 * Lexer that generates various tokens from the program.
 * Supports single line comments and line/column numbering
 * @param program source code
 * @yields A token object
 */
function * lexer(program: string): Generator<Token> {
  const lines = program.split('\n');
  let lineIdx = 0;

  while(lineIdx < lines.length) {
    const line = lines[lineIdx];

    for(let j=0; j < line.length; j++) {
      if (line[j] === ' ' || line[j] === '') continue;
  
      const [token, endPos] = more(line, [lineIdx, j]);
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

/**
 * Parses the given program using a parse table
 * @param program source code
 * @returns an array consiting of productions to derive the program and errors
 */
function parser(program: string): [string[], string] {
  const productions = [];
  const scope = ['Statement'];
  const tokenStream = lexer(program);
  let token = tokenStream.next();

  /**
   * Parse table for this right linear grammar iteration 2
   */
  const parseTable = {
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

  while(!token.done && scope.length) {
    const topToken = token.value;
    const topScope = scope[0];

    if (topScope === 'EPSILON') {
      scope.shift();
    } else if (topToken.type[1] === topScope) {
      // Stream next token as the current token was successfully matched
      token = tokenStream.next();
      scope.shift();
    } else if (parseTable[topScope] && parseTable[topScope][topToken.type[1]]) {
      const production = parseTable[topScope][topToken.type[1]];

      scope.shift();
      scope.unshift(...production.split(' '));
      productions.push([ topScope, '::=', production].join(' '));
    } else {
      let error: string;
      if (parseTable[topScope]) {
        const keys = Object.keys(parseTable[topScope]).filter(key => key !== '$');

        if (keys.length === 1) {
          error = `Expected ${keys[0]} at ${topToken.position.join(':')}`;
        } else {
          error = `Expected one of ${keys.join(', ')} at ${topToken.position.join(':')}`;
        }
      } else {
        error = `Expected ${topScope} at ${topToken.position.join(':')}`;
      }

      return [null, error];
    }
  }

  return [productions, null];
}

readFile(process.argv[2], (err, data) => {
  console.log(parser(data.toString()));
});