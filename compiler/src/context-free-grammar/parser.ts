import { RegularGrammarParser } from '../regular-grammar';
import { SymbolType } from '../regular-grammar/types';

class Parser extends RegularGrammarParser {
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
      [SymbolType.State]: `${SymbolType.State} NextTerm`,
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
}

export default Parser;
