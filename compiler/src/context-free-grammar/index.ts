import RegularGrammarLexer from '../regular-grammar/lexer';
import ContextFreeGrammarParser from './parser';
import RegularGrammarSemanticAnalyzer from '../regular-grammar/semantic';
import { Token, SymbolType, CompilerClass } from '../regular-grammar/types';
import { SimplifiedGrammarRepresentation } from '../utils';

class ContextFreeGrammar extends CompilerClass {
  private firstSets: Record<string, Set<string>>;
  result: any;

  constructor(program: string) {
    super(program);
    this.firstSets = {};
  }

  parse() {
    const [result, error] = new ContextFreeGrammarParser(this.program).parse();
    if (error) {
      this.errors.push(error);
    } else {
      this.parseTree = result;
      this.result = result;
    }

    return this;
  }

  semanticAnalysis() {
    if (!this.errors.length) {
      const errors = new RegularGrammarSemanticAnalyzer(this.parseTree).analyze();
      this.errors.push(...errors.filter(err => err.type === 'Error'));
      this.warnings.push(...errors.filter(err => err.type === 'Warning'));
    }

    return this;
  }

  /**
   * Most of the algorithm for calculating first and follow sets have been
   * referred from https://github.com/MikeDevice/first-follow
   */
  private collectSet(initialSet: Set<string>, items: Token[], additionalSet: Set<string>) {
    let set = new Set(initialSet);

    items.every((item, index) => {
      if (item.type[1] === SymbolType.State) {
        set = new Set([ ...set, ...[...this.firstSets[item.value]].filter((setItem) => setItem !== SymbolType.Empty) ]);

        if (this.firstSets[item.value].has(SymbolType.Empty)) {
          if (items[index + 1]) return true;
          set = new Set([ ...set, ...additionalSet ]);
        }
      } else {
        set.add(item.value);
      }
    });

    return set;
  }

  findFirstSets() {
    if (Object.keys(this.firstSets).length !== 0) return this.firstSets;

    const grammar = new SimplifiedGrammarRepresentation(this.parseTree);

    grammar.rules.forEach(([lhs, ]) => {
      this.firstSets[lhs] = new Set();
    });

    let done = false;

    do {
      done = true;

      grammar.rules.forEach(([lhs, rhs]) => {
        const set = new Set([ ...this.firstSets[lhs], ...this.collectSet(this.firstSets[lhs], rhs, new Set([ SymbolType.Empty ])) ]);

        if (this.firstSets[lhs].size !== set.size) {
          this.firstSets[lhs] = set;
          done = false;
        }
      });
    } while (!done);

    this.result = this.firstSets;

    return this;
  }

  findFollowSets() {
    this.findFirstSets();
    const grammar = new SimplifiedGrammarRepresentation(this.parseTree);
    const FOLLOW: Record<string, Set<string>> = {};

    grammar.rules.forEach(([lhs,]) => {
      FOLLOW[lhs] = new Set(lhs === 'S' ? ['$'] : []);
    });

    let done = false;
    
    do {
      done = true;

      grammar.rules.forEach(([lhs, rhs]) => {
        rhs.forEach((token, i) => {
          if (token.type[1] !== SymbolType.State) return;

          const set = new Set([
            ...FOLLOW[token.value],
            ...i + 1 < rhs.length
              ? this.collectSet(FOLLOW[token.value], rhs.slice(i + 1), FOLLOW[lhs])
              : FOLLOW[lhs],
          ]);

          if (FOLLOW[token.value].size !== set.size) {
            FOLLOW[token.value] = set;
            done = false;
          }
        });
      });
    } while (!done);

    this.result = FOLLOW;

    return this;
  }
}


export {
  RegularGrammarLexer,
  ContextFreeGrammarParser,
  RegularGrammarSemanticAnalyzer,
  ContextFreeGrammar,
};