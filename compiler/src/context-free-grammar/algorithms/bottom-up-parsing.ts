import { ParseTree, SymbolType, Token, TokenType } from '../../regular-grammar/types';
import { GrammarRule, OrderedHashSet, SimplifiedGrammarRepresentation, State } from '../../utils';
import { findFollowSets, PredectiveSets, collectSet, findFirstSets } from './top-down-parsing';

enum ActionType {
  accept = 'accept',
  reduce = 'reduce',
  shift = 'shift',
};
type Action = { action: ActionType, value?: string|number };
type Goto = { action: 'goto', value: number };
type FAGraph = Record<number, Record<string, number>>;

const DollarToken: Token = {
  position: [0, 0],
  type: [TokenType.Keyword, SymbolType.Dollar],
  value: SymbolType.Dollar,
};
class LookAheadState extends State {
  lookahead: Token;

  constructor(nonterminal, expression, lookahead = DollarToken, dot = 0) {
    super(nonterminal, expression, dot);
    this.lookahead = lookahead;
  }

  get shift() {
    return new LookAheadState(this.nonterminal, this.expression, this.lookahead, this.dot + 1);
  }

  get afterSymbolWithLookahead() {
    return [...this.expression.slice(this.dot + 1), this.lookahead];
  }

  hash() {
    return `[${super.hash()}, ${this.lookahead.value}]`;
  }
}

/**
 * Applies CLOSURE operation on the State argument in place without look ahead.
 * 
 * @param set Set of rules on which CLOSURE should be applied.
 * @param grammar Grammar.
 */
function closureOp(set: OrderedHashSet<State>, grammar: SimplifiedGrammarRepresentation) {
  const list = set.unorderedList();

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

/**
 * Applies CLOSURE operation on the State argument in place with 1 look ahead.
 * 
 * @param set Set of rules on which CLOSURE should be applied.
 * @param grammar Grammar.
 * @param firstSets FIRST set of the Grammar.
 */
function closureLookaheadOp(set: OrderedHashSet<LookAheadState>, grammar: SimplifiedGrammarRepresentation, firstSets: PredectiveSets) {
  const list = set.unorderedList();

  for(let i=0; i < list.length; ++i) {
    if (!list[i].symbol_is_nonterminal) continue;

    const firstAfterSymbol = [...collectSet(firstSets, new Set(), list[i].afterSymbolWithLookahead, new Set([ SymbolType.Empty ]))];

    const gen = grammar.trav(list[i].symbol.value);
    let start = gen.next();

    while (!start.done) {
      const rule = start.value as GrammarRule;

      firstAfterSymbol.forEach((b) => {
        let state = new LookAheadState(
          rule.lhs,
          rule.rhs,
          {
            value: b,
            type: [TokenType.Literal, SymbolType.Literal],
            position: [0, 0],
          },
        );

        if (state.symbol_is_null) {
          state = state.shift;
        }

        if (!set.has(state)) {
          set.add(state);
          list.push(state);
        }
      });
      
      start = gen.next();
    }
  }
};

/**
 * Performs the GOTO operation on a state with the given symbol.
 * 
 * @param set Set of rules on which GOTO should be applied.
 * @param symbol Symbol for goto.
 * @param grammar Grammar.
 * @param closureOp Closure operation to be applied after GOTO.
 * @returns State with a set of rules after performing GOTO.
 */
function gotoOp<T extends State>(set: OrderedHashSet<T>, symbol: string, grammar: SimplifiedGrammarRepresentation, closureOp: Function) {
  const result = new OrderedHashSet<T>();
  const list = set.unorderedList();
  list.forEach((state) => {
    if (state.finished) return;
    if (state.symbol.value !== symbol) return;

    result.add(state.shift as T);
  });

  closureOp(result, grammar);
  return result;
};

/**
 * Finds canonical items in the given parse tree based on Closure operation and StateContainer.
 * 
 * @param parseTree Parse Tree of the input. Used to generate augumented grammar.
 * @param StateContainer Type of container to be used for storing a State (or Rule) in parse table.
 * @param closureOp Callable for performing Closure operation on a set of States.
 * @returns List of automata states in the parse table and the graph representing the transitions between the states.
 */
function findCanonicalItems<T extends State>(parseTree: ParseTree, StateContainer: new (lhs: string, rhs: Token[]) => T, closureOp: Function) {

  // Augumenting the grammar
  const augumentedGrammar = new SimplifiedGrammarRepresentation(parseTree);
  const augumentRule = new GrammarRule('_S', [{
    value: 'S',
    position: [1, 7],
    type: [TokenType.Identifier, SymbolType.State],
  }]);
  augumentedGrammar.addRule(augumentRule);

  // CLOSURE on first state
  const graph: FAGraph = {};
  const states: OrderedHashSet<T>[] = [ new OrderedHashSet<T>() ];
  states[0].add(new StateContainer(augumentRule.lhs, augumentRule.rhs));
  closureOp(states[0], augumentedGrammar);

  // Iterate over all the states (may expand in the loop)
  for(let i=0; i < states.length; ++i) {
    // Find all the symbols after dot in all the rules in the state
    const symbols = new Set(states[i].unorderedList().filter((state) => !state.finished).map((state) => state.symbol.value));

    symbols.forEach((symbol) => {
      // For every symbol perform GOTO to get next state
      const nextState = gotoOp(states[i], symbol, augumentedGrammar, closureOp);
      if (nextState.list().length === 0) return;

      const nextStateStr = nextState.toString();
      if (!graph[i]) {
        graph[i] = {};
      }

      // 
      /**
       * If next state does not exist in the set
       *    add it to the set and update the transition
       * Otherwise
       *    update the transition to the existing state index
       */
      const idx = states.findIndex((state) => state.toString() === nextStateStr);

      if (idx === -1) {
        graph[i][symbol] = states.push(nextState) - 1;
      } else {
        graph[i][symbol] = idx;
      }
    });
  }

  return { states, graph };
}


function findLR0Table(parseTree: ParseTree, grammar: SimplifiedGrammarRepresentation) {
  const { graph, states } = findCanonicalItems(parseTree, State, closureOp);

  const actionTableColumns = Object.fromEntries([...grammar.terminals, SymbolType.Dollar].map((term, i) => [term, i]));
  const gotoTableColumns = Object.fromEntries(grammar.nonterminals.map((term, i) => [term, i]));
  const actionTable: Action[][][] = states.map(() => Object.keys(actionTableColumns).map(() => []));
  const gotoTable: Goto[][][] = states.map(() => Object.keys(gotoTableColumns).map(() => []));

  states.forEach((state, i) => {
    if (graph[i]) {
      Object.keys(graph[i]).forEach((symbol) => {
        const actionIdx = actionTableColumns[symbol];
        const gotoIdx = gotoTableColumns[symbol];

        if (actionIdx !== undefined) {
          actionTable[i][actionIdx].push({ action: ActionType.shift, value: graph[i][symbol] });
        } else {
          gotoTable[i][gotoIdx].push({ action: 'goto', value: graph[i][symbol] });
        }
      });
    }

    const reduced: Action[] = state
      .list()
      .filter((st) => st.finished)
      .map((st) => (st.nonterminal === '_S')
        ? { action: ActionType.accept }
        : {
            action: ActionType.reduce,
            value: st.hash().slice(0, -1)
          }
        );

    if (reduced.length) {
      for(let j=0; j < actionTable[i].length; ++j) {
        actionTable[i][j].push(...reduced);
      }
    }
  });

  return {
    graph,
    states,
    actionTable,
    gotoTable,
    actionTableColumns: Object.keys(actionTableColumns),
    gotoTableColumns: Object.keys(gotoTableColumns),
  };
}


function findSLR1Table(parseTree: ParseTree, grammar: SimplifiedGrammarRepresentation) {
  const { graph, states } = findCanonicalItems(parseTree, State, closureOp);
  const followSets = findFollowSets(grammar);

  const actionTableColumns = Object.fromEntries([...grammar.terminals, SymbolType.Dollar].map((term, i) => [term, i]));
  const gotoTableColumns = Object.fromEntries(grammar.nonterminals.map((term, i) => [term, i]));
  const actionTable: Action[][][] = states.map(() => Object.keys(actionTableColumns).map(() => []));
  const gotoTable: Goto[][][] = states.map(() => Object.keys(gotoTableColumns).map(() => []));

  states.forEach((state, i) => {
    if (graph[i]) {
      Object.keys(graph[i]).forEach((symbol) => {
        const actionIdx = actionTableColumns[symbol];
        const gotoIdx = gotoTableColumns[symbol];

        if (actionIdx !== undefined) {
          actionTable[i][actionIdx].push({ action: ActionType.shift, value: graph[i][symbol] });
        } else {
          gotoTable[i][gotoIdx].push({ action: 'goto', value: graph[i][symbol] });
        }
      });
    }

    const hasAcceptedState = state.list().some((st) => st.finished && st.nonterminal === '_S');
    const reduced: State[] = state.list().filter((st) => st.finished && st.nonterminal !== '_S')

    if (hasAcceptedState) {
      actionTable[i][actionTableColumns[SymbolType.Dollar]].push({ action: ActionType.accept });
    }

    reduced.forEach((st) => {
      followSets[st.nonterminal].forEach((symbol) => {
        actionTable[i][actionTableColumns[symbol]].push({
          action: ActionType.reduce,
          value: st.hash().slice(0, -1),
        });
      });
    });
  });

  return {
    graph,
    states,
    actionTable,
    gotoTable,
    actionTableColumns: Object.keys(actionTableColumns),
    gotoTableColumns: Object.keys(gotoTableColumns),
  };
}


function findLR1Table(parseTree: ParseTree, grammar: SimplifiedGrammarRepresentation) {
  const firstSets = findFirstSets(grammar);
  const closureOp = (set: OrderedHashSet<LookAheadState>, grammar: SimplifiedGrammarRepresentation) => closureLookaheadOp(set, grammar, firstSets);

  const { graph, states } = findCanonicalItems(parseTree, LookAheadState, closureOp);

  const actionTableColumns = Object.fromEntries([...grammar.terminals, SymbolType.Dollar].map((term, i) => [term, i]));
  const gotoTableColumns = Object.fromEntries(grammar.nonterminals.map((term, i) => [term, i]));
  const actionTable: Action[][][] = states.map(() => Object.keys(actionTableColumns).map(() => []));
  const gotoTable: Goto[][][] = states.map(() => Object.keys(gotoTableColumns).map(() => []));

  states.forEach((state, i) => {
    if (graph[i]) {
      Object.keys(graph[i]).forEach((symbol) => {
        const actionIdx = actionTableColumns[symbol];
        const gotoIdx = gotoTableColumns[symbol];

        if (actionIdx !== undefined) {
          actionTable[i][actionIdx].push({ action: ActionType.shift, value: graph[i][symbol] });
        } else {
          gotoTable[i][gotoIdx].push({ action: 'goto', value: graph[i][symbol] });
        }
      });
    }

    const hasAcceptedState = state.list().some((st) => st.finished && st.nonterminal === '_S');
    const reduced: LookAheadState[] = state.list().filter((st) => st.finished && st.nonterminal !== '_S')

    if (hasAcceptedState) {
      actionTable[i][actionTableColumns[SymbolType.Dollar]].push({ action: ActionType.accept });
    }

    reduced.forEach((st) => {
      actionTable[i][actionTableColumns[st.lookahead.value]].push({
        action: ActionType.reduce,
        value: `${st.nonterminal} ${SymbolType.Follow} ${st.expression.map(t => t.value).join(' ')}`,
      });
    });
  });

  return {
    graph,
    states,
    actionTable,
    gotoTable,
    actionTableColumns: Object.keys(actionTableColumns),
    gotoTableColumns: Object.keys(gotoTableColumns),
  };
}

export { findLR0Table, findSLR1Table, findLR1Table };
