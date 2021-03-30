import { ParseTree, SymbolType, TokenType } from '../../regular-grammar/types';
import { GrammarRule, HashSet, SimplifiedGrammarRepresentation, State } from '../../utils';
import { findFollowSets } from './top-down-parsing';

enum ActionType {
  accept = 'accept',
  reduce = 'reduce',
  shift = 'shift',
};
type Action = { action: ActionType, value?: string|number };
type Goto = { action: 'goto', value: number };
type FAGraph = Record<number, Record<string, number>>;

function closureOp(set: HashSet<State>, grammar: SimplifiedGrammarRepresentation) {
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

function gotoOp(set: HashSet<State>, symbol: string, grammar: SimplifiedGrammarRepresentation) {
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

function findLR0CanonicalItems(parseTree: ParseTree) {
  const augumentedGrammar = new SimplifiedGrammarRepresentation(parseTree);
  const augumentRule = new GrammarRule('_S', [{
    value: 'S',
    position: [1, 7],
    type: [TokenType.Identifier, SymbolType.State],
  }]);
  augumentedGrammar.addRule(augumentRule);

  const graph: FAGraph = {};
  const states: HashSet<State>[] = [ new HashSet<State>() ];
  states[0].add(new State(augumentRule.lhs, augumentRule.rhs));
  closureOp(states[0], augumentedGrammar);

  for(let i=0; i < states.length; ++i) {
    const symbols = new Set(states[i].list().filter((state) => !state.finished).map((state) => state.symbol.value));

    symbols.forEach((symbol) => {
      const nextState = gotoOp(states[i], symbol, augumentedGrammar);
      if (nextState.list().length === 0) return;

      const nextStateStr = nextState.toString();

      const idx = states.findIndex((state) => state.toString() === nextStateStr);
      if (!graph[i]) {
        graph[i] = {};
      }

      if (idx === -1 ) {
        graph[i][symbol] = states.push(nextState) - 1;
      } else {
        graph[i][symbol] = idx;
      }
    });
  }

  return { states, graph };
}


function findLR0Table(parseTree: ParseTree, grammar: SimplifiedGrammarRepresentation) {
  const { graph, states } = findLR0CanonicalItems(parseTree);

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
  const { graph, states } = findLR0CanonicalItems(parseTree);
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

export { findLR0Table, findSLR1Table };
