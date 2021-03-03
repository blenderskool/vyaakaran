import { RegularGrammarParser } from '../regular-grammar';
import { SymbolType } from '../regular-grammar/types';

class Parser extends RegularGrammarParser {
  protected static readonly parseTable = {
    'Statement': {
      [SymbolType.State]: `${SymbolType.State} ${SymbolType.Follow} Symbol Expression ${SymbolType.Dot} Statement`,
      '$': `EPSILON`,
    },
    'Expression': {
      [SymbolType.Dot]: `EPSILON`,
      [SymbolType.Or]: `${SymbolType.Or} Symbol Expression`,
    },
    'Term': {
      [SymbolType.State]: `${SymbolType.State} NextTerm`,
      [SymbolType.Literal]: `${SymbolType.Literal} NextTerm`,
    },
    'Symbol': {
      [SymbolType.State]: `Term`,
      [SymbolType.Literal]: `Term`,
      [SymbolType.Empty]: `${SymbolType.Empty}`,
    },
    'NextTerm': {
      [SymbolType.State]: `Term`,
      [SymbolType.Literal]: `Term`,
      [SymbolType.Or]: `EPSILON`,
      [SymbolType.Dot]: `EPSILON`,
    },
  };
}

export default Parser;
