import { SymbolType, ParseTree } from '../types';
import { GrammarRule, HashSet, SimplifiedGrammarRepresentation, State } from '../utils';

class EarleyState extends State {
  origin: number;

  constructor(nonterminal, expression, dot = 0, origin = 0) {
    super(nonterminal, expression, dot);
    this.origin = origin;
  }

  get shift() {
    return new EarleyState(this.nonterminal, this.expression, this.dot + 1, this.origin);
  }

  hash() {
    return `${this.origin} ${super.hash()}`;
  }
}

/**
 * EarleyParser implementation for validating input strings against CFGs.
 * 
 * Most of this code is a port of Tomáš Bouda's Python implementation of EarleyParser.
 * 
 * Some changes have been made in terms of how null rules are handled.
 * Reference: https://loup-vaillant.fr/tutorials/earley-parsing/
 */
class EarleyParser {
  states: HashSet<EarleyState>[];
  grammar: SimplifiedGrammarRepresentation;

  constructor(grammar: SimplifiedGrammarRepresentation);
  constructor(parseTree: ParseTree);
  constructor(input: SimplifiedGrammarRepresentation | ParseTree) {
    this.grammar = input instanceof SimplifiedGrammarRepresentation ? input : new SimplifiedGrammarRepresentation(input);
    this.states = [];
  }

  parse(text: string) {
    // If text to check is empty, then just add a empty symbol
    if (text === '') {
      text = SymbolType.Empty;
    }

    text = text.replace(/ +/g, ' ');
    this.states = [ new HashSet() ];
    text.split(' ').forEach(() => this.states.push(new HashSet()));

    const gen = this.grammar.trav('S');
    let start = gen.next();
    while (!start.done) {
      const rule = start.value as  GrammarRule;
      this.states[0].add(new EarleyState(rule.lhs, rule.rhs));

      start = gen.next();
    }

    text.concat(' \u0000').split(' ').forEach((token, k) => {
      const extension: EarleyState[] = this.states[k].list();
      this.states[k].clear();

      while(extension.length) {
        const state = extension.pop();
        if (this.states[k].has(state)) continue;

        this.states[k].add(state);

        if (state.symbol_is_null) {
          extension.push(state.shift);
        }

        if (state.finished) {
          this.completer(state, extension)
        } else if (state.symbol_is_nonterminal) {
          this.predictor(state, k, extension);
        } else {
          this.scanner(state, k, token);
        }
      }

    });
  }

  isParsable(text: string): number {
    this.parse(text);

    const lastState: EarleyState[] = this.states[this.states.length - 1].list();
    return lastState.reduce((acc, state) => acc + Number(state.finished && state.origin === 0 && state.nonterminal === 'S'), 0);
  }

  private predictor(state: EarleyState, origin, extension: State[]) {
    const gen = this.grammar.trav(state.symbol.value);
    let it = gen.next();
    while(!it.done) {
      const rule = it.value as GrammarRule;
      const predictedState = new EarleyState(rule.lhs, rule.rhs, 0, origin);
      extension.push(predictedState);

      if (predictedState.symbol && this.grammar.isNull(predictedState.symbol.value)) {
        extension.push(predictedState.shift);
      }

      it = gen.next();
    }
  }

  private scanner(state: EarleyState, origin, token) {
    if (state.symbol.value === token) {
      this.states[origin + 1].add(state.shift);
    }
  }
  
  private completer(state: EarleyState, extension: State[]) {
    this.states[state.origin].list().forEach((reduce: State) => {
      if (state.nonterminal === reduce.symbol?.value) {
        extension.push(reduce.shift);
      }
    });
  }
}

export { EarleyParser };
