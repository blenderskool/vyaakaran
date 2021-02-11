import { SymbolType, ParseTree, Token } from './regular-grammar/types';
import { HashSet, SimplifiedGrammarRepresentation } from './utils';

class State {
  nonterminal: string;
  expression: Token[];
  dot: number;
  origin: number;

  constructor(nonterminal, expression, dot = 0, origin = 0) {
    this.nonterminal = nonterminal;
    this.expression = expression;
    this.dot = dot;
    this.origin = origin;
  }

  get finished() {
    return this.dot >= this.expression.length;
  }

  get symbol() {
    return this.finished ? null : this.expression[this.dot];
  }

  get symbol_is_nonterminal() {
    return this.symbol && this.symbol.type[1] === SymbolType.State;
  }

  get symbol_is_null() {
    return this.symbol && this.symbol.type[1] === SymbolType.Empty;
  }

  get shift() {
    return new State(this.nonterminal, this.expression, this.dot + 1, this.origin);
  }

  hash() {
    return `${this.origin} ${this.nonterminal} -> ${this.expression.slice(0, this.dot).map(t => t.value).join(' ')}.${this.expression.slice(this.dot).map(t => t.value).join(' ')}`;
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
  states: HashSet[];
  grammar: SimplifiedGrammarRepresentation;

  constructor(parseTree: ParseTree) {
    this.grammar = new SimplifiedGrammarRepresentation(parseTree);
    this.states = [];
  }

  parse(text: string) {
    text = text.replace(/\.+/g, '.');
    this.states = [ new HashSet(), ...text.split('.').map(() => new HashSet()) ];

    const gen = this.grammar.trav('S');
    let start = gen.next();
    while (!start.done) {
      this.states[0].add(new State(start.value[0], start.value[1]));

      start = gen.next();
    }

    text.concat('.\u0000').split('.').forEach((token, k) => {
      const extension: State[] = this.states[k].list();
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

  isParsable(text: string) {
    this.parse(text);

    const lastState: State[] = this.states[this.states.length - 1].list();
    return lastState.some((state) => state.finished && state.origin === 0);
  }

  private predictor(state: State, origin, extension: State[]) {
    const gen = this.grammar.trav(state.symbol.value);
    let rule = gen.next();
    while(!rule.done) {
      extension.push(new State(rule.value[0], rule.value[1], 0, origin));

      if (this.grammar.isNull(rule.value[0])) {
        extension.push(state.shift);
      }

      rule = gen.next();
    }
  }

  private scanner(state: State, origin, token) {
    if (state.symbol.value === token) {
      this.states[origin + 1].add(state.shift);
    }
  }
  
  private completer(state: State, extension: State[]) {
    this.states[state.origin].list().forEach((reduce: State) => {
      if (state.nonterminal === reduce.symbol?.value) {
        extension.push(reduce.shift);
      }
    });
  }
}

export { EarleyParser };
