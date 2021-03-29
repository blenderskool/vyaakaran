import RegularGrammarLexer from '../regular-grammar/lexer';
import ContextFreeGrammarParser from './parser';
import ContextFreeGrammarSemanticAnalyzer from './semantic';
import { Token, SymbolType, CompilerClass, TokenType } from '../regular-grammar/types';
import { SimplifiedGrammarRepresentation, GrammarRule, HashSet, State } from '../utils';

class ContextFreeGrammar extends CompilerClass {
  private firstSets: Record<string, Set<string>>;
  private grammar: SimplifiedGrammarRepresentation;
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
      const errors = new ContextFreeGrammarSemanticAnalyzer(this.parseTree).analyze();
      this.errors.push(...errors.filter(err => err.type === 'Error'));
      this.warnings.push(...errors.filter(err => err.type === 'Warning'));
    }

    if (!this.errors.length) {
      this.grammar = new SimplifiedGrammarRepresentation(this.parseTree);
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

    this.grammar.rules.forEach(({ lhs }) => {
      this.firstSets[lhs] = new Set();
    });

    let done = false;

    do {
      done = true;

      this.grammar.rules.forEach(({ lhs, rhs }) => {
        const set = new Set([ ...this.firstSets[lhs], ...this.collectSet(this.firstSets[lhs], rhs, new Set([ SymbolType.Empty ])) ]);

        if (this.firstSets[lhs].size !== set.size) {
          this.firstSets[lhs] = set;
          done = false;
        }
      });
    } while (!done);

    return this.firstSets;
  }

  findFollowSets() {
    this.findFirstSets();
    const FOLLOW: Record<string, Set<string>> = {};

    this.grammar.rules.forEach(({ lhs }) => {
      FOLLOW[lhs] = new Set(lhs === 'S' ? [SymbolType.Dollar] : []);
    });

    let done = false;
    
    do {
      done = true;

      this.grammar.rules.forEach(({ lhs, rhs }) => {
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

    return FOLLOW;
  }

  toLL1() {
    this.findFirstSets();
    const follow: Record<string, Set<string>> = this.findFollowSets();

    const nonterminals = this.grammar.nonterminals;
    const columns = Object.fromEntries([...this.grammar.terminals, SymbolType.Dollar].map((term, i) => [term, i]));
    
    const parseTable: string[][][] = nonterminals.map(() => Object.keys(columns).map(() => []));

    nonterminals.forEach((nonterminal, i) => {
      const gen = this.grammar.trav(nonterminal);
      let it = gen.next();
      while (!it.done) {
        const rule = it.value as GrammarRule;

        if (rule.rhs[0].type[1] === SymbolType.Empty) {
          follow[nonterminal].forEach((terminal) => {
            parseTable[i][columns[terminal]].push(rule.toString());
          });
        } else {
          const firstSet = [...this.collectSet(new Set(), rule.rhs, new Set([ SymbolType.Empty ]))];

          firstSet.forEach((first) => {
            if (first === SymbolType.Empty) return;

            parseTable[i][columns[first]].push(rule.toString());
          });
        }

        it = gen.next();
      }
    });

    let conflicts = 0;
    parseTable.forEach((row) => {
      row.forEach((col) => {
        if (col.length > 1) {
          conflicts++;
        }
      });
    });

    const conclusions = [];
    if (conflicts === 0) {
      conclusions.push('This grammar is LL(1)');
    } else {
      conclusions.push('This grammar is not LL(1)');
      conclusions.push(`${conflicts} conflicts found`);
    }

    this.result = { conflicts, parseTable, columns, conclusions };

    return this;
  }

  toLR0() {
    const grammar = new SimplifiedGrammarRepresentation(this.parseTree);
    const augumentRule = new GrammarRule('_S', [{
      value: 'S',
      position: [1, 7],
      type: [TokenType.Identifier, SymbolType.State],
    }]);
    grammar.addRule(augumentRule);

    const closureOp = (set: HashSet<State>, grammar: SimplifiedGrammarRepresentation) => {
      const list = set.list();

      for(let i=0; i < list.length; ++i) {
        if (!list[i].symbol_is_nonterminal) continue;

        const gen = grammar.trav(list[i].symbol.value);
        let start = gen.next();

        while (!start.done) {
          const rule = start.value as GrammarRule;
          let state = new State(rule.lhs, rule.rhs);
          if (state.symbol_is_null) {
            state = state.shift;
          }

          if (!set.has(state)) {
            set.add(state);
            list.push(state);
          }

          start = gen.next();
        }
      }
    };

    const gotoOp = (set: HashSet<State>, symbol: string, grammar: SimplifiedGrammarRepresentation) => {
      const result = new HashSet<State>();
      const list = set.list();
      list.forEach((state) => {
        if (state.finished) return;
        if (state.symbol.value !== symbol) return;

        result.add(state.shift);
      });

      closureOp(result, grammar);
      return result;
    };

    const FAGraph: Record<number, Record<string, number>> = {};
    const FAStates: HashSet<State>[] = [ new HashSet<State>() ];
    FAStates[0].add(new State(augumentRule.lhs, augumentRule.rhs));
    closureOp(FAStates[0], grammar);

    for(let i=0; i < FAStates.length; ++i) {
      const symbols = new Set(FAStates[i].list().filter((state) => !state.finished).map((state) => state.symbol.value));

      symbols.forEach((symbol) => {
        const nextState = gotoOp(FAStates[i], symbol, grammar);
        if (nextState.list().length === 0) return;

        const nextStateStr = nextState.toString();

        const idx = FAStates.findIndex((state) => state.toString() === nextStateStr);
        if (!FAGraph[i]) {
          FAGraph[i] = {};
        }

        if (idx === -1 ) {
          FAGraph[i][symbol] = FAStates.push(nextState) - 1;
        } else {
          FAGraph[i][symbol] = idx;
        }
      });
    }

    type Action = { action: 'accept' | 'reduce' | 'shift', value?: string|number };
    type Goto = { action: 'goto', value: number };

    const actionTableColumns = Object.fromEntries([...this.grammar.terminals, SymbolType.Dollar].map((term, i) => [term, i]));
    const gotoTableColumns = Object.fromEntries(this.grammar.nonterminals.map((term, i) => [term, i]));
    const actionTable: Action[][][] = FAStates.map(() => Object.keys(actionTableColumns).map(() => []));
    const gotoTable: Goto[][][] = FAStates.map(() => Object.keys(gotoTableColumns).map(() => []));

    FAStates.forEach((state, i) => {
      if (FAGraph[i]) {
        Object.keys(FAGraph[i]).forEach((symbol) => {
          const actionIdx = actionTableColumns[symbol];
          const gotoIdx = gotoTableColumns[symbol];

          if (actionIdx !== undefined) {
            actionTable[i][actionIdx].push({ action: 'shift', value: FAGraph[i][symbol] });
          } else {
            gotoTable[i][gotoIdx].push({ action: 'goto', value: FAGraph[i][symbol] });
          }
        });
      }

      const reduced: Action[] = state
        .list()
        .filter((st) => st.finished)
        .map((st) => (st.nonterminal === '_S')
          ? { action: 'accept' }
          : {
              action: 'reduce',
              value: st.hash().slice(0, -1)
            }
          );

      if (reduced.length) {
        for(let j=0; j < actionTable[i].length; ++j) {
          actionTable[i][j].push(...reduced);
        }
      }
    });

    const conclusions = [];
    let ShiftReduceConflicts = 0;
    let ReduceReduceConflicts = 0;
    let ShiftShiftConflicts = 0;
    actionTable.forEach((row) => {
      row.forEach(cell => {
        const shiftCnt = cell.reduce((cnt, op) => Number(op.action === 'shift') + cnt, 0);
        const reduceCnt = cell.reduce((cnt, op) => Number(op.action === 'reduce' || op.action === 'accept') + cnt, 0);
        if (shiftCnt && reduceCnt) ++ShiftReduceConflicts;
        if (reduceCnt > 1) ++ReduceReduceConflicts;
        if (shiftCnt > 1) ++ShiftShiftConflicts;
      });
    });

    if (ShiftReduceConflicts + ReduceReduceConflicts + ReduceReduceConflicts === 0) {
      conclusions.push('This grammar is LR(0)');
    } else {
      conclusions.push('This grammar is not LR(0)');
    }

    if (ShiftShiftConflicts)
      conclusions.push(`${ShiftShiftConflicts} shift/shift conflicts found`);

    if (ReduceReduceConflicts)
      conclusions.push(`${ReduceReduceConflicts} reduce/reduce conflicts found`);

    if (ShiftReduceConflicts)
      conclusions.push(`${ShiftReduceConflicts} shift/reduce conflicts found`);

    this.result = {
      actionTable,
      gotoTable,
      actionTableColumns: Object.keys(actionTableColumns),
      gotoTableColumns: Object.keys(gotoTableColumns),
      FAGraph,
      FAStates,
      conclusions
    };
    return this;
  }

  get terminals() {
    return this.grammar.terminals;
  }

  get nonterminals() {
    return this.grammar.nonterminals;
  }
}


export {
  RegularGrammarLexer,
  ContextFreeGrammarParser,
  ContextFreeGrammarSemanticAnalyzer,
  ContextFreeGrammar,
};