import RegularGrammarLexer from './lexer';
import RegularGrammarParser from './parser';
import RegularGrammarSemanticAnalyzer from './semantic';
import { ParseTree, Token, SymbolType, CompilerClass } from '../types';
import { getGeneratorReturn, SimplifiedGrammarRepresentation } from '../utils';

type FAGraph = Record<
  string,
  { nodes: Record<string, Set<string>>; final: boolean }
>;

class RegularGrammar extends CompilerClass {
  result: any;

  constructor(program: string) {
    super(program);
  }

  parse() {
    const [result, error] = new RegularGrammarParser(this.program).parse();
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
      const errors = new RegularGrammarSemanticAnalyzer(
        this.parseTree as ParseTree
      ).analyze();
      this.errors.push(...errors.filter((err) => err.type === 'Error'));
      this.warnings.push(...errors.filter((err) => err.type === 'Warning'));
    }

    return this;
  }

  /**
   * Constructs a finite automata from the parse tree
   * Involves following steps:
   *    - Finds all "NON-TERMINAL" -> "TERMS" rules from the parse tree using DFS in Grammar2DRepresentation.
   *      Every OR production is extracted separately here.
   *
   *    Reference: http://www.jflap.org/modules/ConvertedFiles/Regular%20Grammar%20to%20DFA%20Conversion%20Module.pdf
   *    - For each of the above rules:
   *        1. If production is of the form  Vi -> w.Vj where w is one or more terminals, then
   *          a series of states are created which derive w from Vi and end in Vj.
   *          Intermidate states get added for every terminal in w.
   *
   *        2. If production is of the form Vi -> w where w is one or more terminals, then
   *          a series of states are created which derive w from Vi and end in a final state _FIN.
   *          Intermidate states get added for every terminal in w.
   *
   *        3. If the production is of the form Vi -> ε, then
   *          Vi is marked as a final state
   *
   *        4. If the production is of the form Vi -> Vj, then
   *          a ∈ transition from Vi to Vj is added in the graph
   */
  *toFAGenerator(explain = true) {
    if (this.errors.length) return this;

    const graph: FAGraph = {};
    let midStateCnt = 0;

    /**
     * Helper method to add a transition in the graph.
     * It creates an adjacency list for new nodes as they come.
     */
    const addToGraph = (from, via, to) => {
      if (!graph[from]) {
        graph[from] = { nodes: {}, final: false };
      }

      if (!graph[from].nodes[via]) {
        graph[from].nodes[via] = new Set();
      }
      graph[from].nodes[via].add(to);
    };

    const rules = new SimplifiedGrammarRepresentation(
      this.parseTree as ParseTree
    ).rules;

    for (const rule of rules) {
      const { lhs: context, rhs: termsStack } = rule;
      const ruleString = rule.toString();

      // Add intermediate states and transitions. Required for Rule 1, 2
      let start = context;
      for (let i = 0; i < termsStack.length - 1; i++) {
        const term = termsStack[i];

        if (!graph[start]) {
          graph[start] = { nodes: {}, final: false };
        }

        const toState =
          termsStack[i + 1].type[1] === SymbolType.State
            ? termsStack[i + 1].value
            : `_S-${++midStateCnt}`;
        addToGraph(start, term.value, toState);

        if (!graph[toState]) {
          graph[toState] = { nodes: {}, final: false };
        }

        if (explain) {
          yield {
            graph,
            step: `Add transition from ${start} via ${term.value} to ${toState}`,
            rule: ruleString,
          };
        }

        start = toState;
      }

      // Rule 4
      if (
        termsStack.length === 1 &&
        termsStack[0].type[1] === SymbolType.State
      ) {
        const toState = termsStack[0].value;
        addToGraph(context, '#', toState);

        if (!graph[toState]) {
          graph[toState] = { nodes: {}, final: false };
        }

        if (explain) {
          yield {
            graph,
            step: `Production is of form Vi -> Vj, add ε transition from state ${context} to ${toState} in graph`,
            rule: ruleString,
          };
        }
      }

      switch (termsStack[termsStack.length - 1].type[1]) {
        // Rule 2 (Adding transition to _FIN state)
        case SymbolType.Literal:
          if (!graph['_FIN']) {
            graph['_FIN'] = { nodes: {}, final: true };
          }
          const { value } = termsStack[termsStack.length - 1];
          addToGraph(start, value, '_FIN');
          if (explain) {
            yield {
              graph,
              step: `Production ends at a terminal, add transition to FINAL state`,
              rule: ruleString,
            };
          }
          break;

        // Rule 3
        case SymbolType.Empty:
          if (!graph[context]) {
            graph[context] = { nodes: {}, final: false };
          }
          graph[context].final = true;
          if (explain) {
            yield {
              graph,
              step: `Production derives to ε, mark ${context} as final state`,
              rule: ruleString,
            };
          }
      }
    }

    this.result = graph;
    return this;
  }

  toFA() {
    return getGeneratorReturn(this.toFAGenerator(false));
  }

  /**
   * Naive Finite Automata Optimizer
   *
   * Optimizes the following:
   *    - Removes unreachable states (states without any incoming transitions)
   *    - Removes states which can't reach any final states.
   *    - TODO: Merge duplicate states (states which have same outgoing transitions)
   */
  optimizeFA() {
    const graph: FAGraph = this.result;
    let incomingNodes = new Set(['S']);

    // Construct set of all nodes that have incoming edges
    for (const from in graph) {
      for (const via in graph[from].nodes) {
        incomingNodes = new Set([...incomingNodes, ...graph[from].nodes[via]]);
      }
    }

    // Remove nodes which are unreachable
    for (const from in graph) {
      if (!incomingNodes.has(from)) {
        delete graph[from];
      }
    }

    this.result = graph;
    return this;
  }

  /**
 * Optimizes the DFA by removing states that cannot reach a final state.
 *
 * 1. Find Reachable States:
 *    a. Iterate while there are changes to be made (`changed` is true):
 *       - Set `changed` to false at the start of each iteration.
 *       - For each state in the graph:
 *         - Skip if the state is already in `reachableFinal`.
 *         - For each outgoing transition from the state:
 *           - Check if any destination state of the transition is in `reachableFinal`.
 *           - If so, add the current state to `reachableFinal`, set `changed` to true, and break to start a new iteration.
 * 
 * 2. Remove Unreachable States:
 *    - For each state in the graph:
 *      - Remove the state from the graph if it is not in `reachableFinal`.
 */


  optimizeReachableFinal() {
    const graph: FAGraph = this.result;
    const finalStates: Set<string> = new Set(
      Object.keys(this.result).filter((state) => this.result[state].final)
    );
    const reachableFinal = new Set<string>([...finalStates]);
    let changed = true;

    // Iterate until no more changes
    while (changed) {
      changed = false;
      for (const from in graph) {
        if (reachableFinal.has(from)) continue;
          for (const via in graph[from].nodes) {
            if (
              Array.from(graph[from].nodes[via]).some((to) =>
                reachableFinal.has(to)
              )
            ) {
              reachableFinal.add(from);
              changed = true;
              break;
            }
          }
        
      }

    // Remove states that can't reach a final state
    for (const from in graph) {
      if (reachableFinal.has(from)) continue;
      delete graph[from];
      
    }

    this.result = graph;
    return this;
  }

  /**
   * Constructs Epsilon-Free Finite Automata by using Epsilon Finite Automata.
   *
   * Makes use of following rules:
   *  - For all Vi -ε-> Vj transitions as T:
   *    - Add all non ε transitions from Vj to any other Vk as transitions from Vi to Vk
   *    - If there's some Vj -ε-> Vk transition, then
   *          - Add all non ε transitions from Vk to any other Vn as transitions from Vi to Vn
   *          - Repeat this recusively for all states along the path that have some outgoing ε transition (using DFS)
   *          - If Vn is a final state, mark Vj as final
   *    - Remove transition T
   *
   *    - If Vj is a final state, mark Vi also final
   *
   * NOTE: Optimizer should be run to remove unreachable states after transition deletions in above steps.
   */
  toEpsilonFreeFA() {
    const visited: Set<string> = new Set();
    const graph: FAGraph = this.toFA().result;
    const resultGraph: FAGraph = {};

    // DFS to get all non ε transitions along ε transition path recursively
    const dfs = (root: string, stack: [string, string][]) => {
      if (visited.has(root)) return;
      visited.add(root);

      for (const via in graph[root].nodes) {
        if (via === '#') continue;

        graph[root].nodes[via].forEach((to) => {
          stack.push([via, to]);
        });
      }
      if (graph[root].nodes['#']) {
        graph[root].nodes['#'].forEach((to) => {
          dfs(to, stack);

          if (graph[to].final) {
            graph[root].final = true;
          }
        });
      }
    };

    // For every node in the graph, check if ε transitions exist
    for (const node in graph) {
      resultGraph[node] = {
        nodes: { ...graph[node].nodes },
        final: graph[node].final,
      };

      // If no ε transition exist, then check next node
      if (!graph[node].nodes['#']) continue;

      // Remove the ε transition
      delete resultGraph[node].nodes['#'];

      // For all the nodes reachable via ε transition, get all non ε transition stack along the path using DFS
      graph[node].nodes['#'].forEach((to) => {
        const stack: [string, string][] = [];
        visited.clear();
        dfs(to, stack);

        // Add the transitions from the stack
        stack.forEach(([via, to]) => {
          const { nodes } = resultGraph[node];
          if (!nodes[via]) {
            nodes[via] = new Set();
          }
          nodes[via].add(to);
        });

        // Marking the current node final if to node is final
        if (graph[to].final) {
          resultGraph[node].final = true;
        }
      });
    }

    this.result = resultGraph;
    return this;
  }

  /**
   * Constructs a Regular Expression from Finite Automata.
   *
   * Makes use of Brzozowski algebraic method
   * Reference: This amazing StackOverflow answer - https://cs.stackexchange.com/a/2392
   */
  toRegEx() {
    const graph: FAGraph = this.toEpsilonFreeFA().optimizeFA().result;

    const sigma: Set<String> = new Set();
    const dfs = (root: ParseTree) => {
      if (!root) return;
      if (!root.body) return;

      if (root.type === SymbolType.Literal) {
        const token = root.body[0] as Token;
        sigma.add(token.value);
      }

      for (let i = 0; i < root.body.length; i++) {
        dfs(root.body[i] as ParseTree);
      }
    };
    dfs(this.parseTree as ParseTree);

    const star = (exp) => {
      if (!exp || exp === 'ε') return 'ε';

      return exp + '*';
    };
    const concat = (a, b) => {
      if (!a || !b) return '';

      if (a === 'ε') return b;
      if (b === 'ε') return a;

      return `(${a}.${b})`;
    };

    const union = (a, b) => {
      if (!a || !b || a === b) return a || b;

      return `(${a} + ${b})`;
    };

    const nodes = ['S', ...Object.keys(graph).filter((s) => s !== 'S')];
    const A = [];
    const B = [];

    for (let i = 0; i < nodes.length; i++) {
      B[i] = graph[nodes[i]].final ? 'ε' : '';
      A[i] = [];

      for (let j = 0; j < nodes.length; j++) {
        A[i][j] = '';
        sigma.forEach((a: string) => {
          A[i][j] = union(
            A[i][j],
            graph[nodes[i]].nodes[a]?.has(nodes[j]) ? a : ''
          );
        });
      }
    }

    for (let n = B.length - 1; n >= 0; n--) {
      B[n] = concat(star(A[n][n]), B[n]);

      for (let j = 0; j < n; j++) {
        A[n][j] = concat(star(A[n][n]), A[n][j]);
      }

      for (let i = 0; i < n; i++) {
        B[i] = union(B[i], concat(A[i][n], B[n]));

        for (let j = 0; j < n; j++) {
          A[i][j] = union(A[i][j], concat(A[i][n], A[n][j]));
        }
      }
    }

    this.result = B[0];

    return this;
  }

  /**
   * Constructs a Deterministic Finite Automaton (DFA) from a Non-deterministic Finite Automaton (NFA).
   * 1. Create a DFA start state from the NFA start state
   * 2. For each DFA state and each input symbol:
   *    a. Compute the set of NFA states reachable from the current DFA state
   *    b. If this set of states is new, add it as a new DFA state
   * 3. Repeat step 2 until no new DFA states are created
   * 4. Mark DFA states as final if they contain any NFA final states
   **/
  toDFA() {
    const nfa: FAGraph = this.toEpsilonFreeFA().result;
    const dfa: FAGraph = {};
    const alphabet: Set<string> = new Set();
    const stateQueue: Set<string>[] = [];
    const processedStates: Set<string>[] = [];
    const DEAD_STATE = 'Φ';

    // Get the alphabet(List of terminals)
    for (const state in nfa) {
      for (const symbol in nfa[state].nodes) {
        alphabet.add(symbol);
      }
    }

    dfa[DEAD_STATE] = { nodes: {}, final: false };
    for (const symbol of alphabet) {
      dfa[DEAD_STATE].nodes[symbol] = new Set([DEAD_STATE]);
    }

    // Helper function to get the next state set
    const getNextStateSet = (
      currentSet: Set<string>,
      symbol: string
    ): Set<string> => {
      const nextSet = new Set<string>();
      for (const state of currentSet) {
        if (nfa[state].nodes[symbol]) {
          nfa[state].nodes[symbol].forEach((nextState) =>
            nextSet.add(nextState)
          );
        }
      }
      return nextSet;
    };

    // Helper function to convert set to sorted string (for state naming)
    const setToString = (set: Set<string>): string =>
      Array.from(set).sort().join(',');

    // Start with the initial state
    const initialState = new Set(['S']);
    stateQueue.push(initialState);

    while (stateQueue.length > 0) {
      const currentSet = stateQueue.shift()!;
      const currentState = setToString(currentSet);

      if (processedStates.some((set) => setToString(set) === currentState))
        continue;

      processedStates.push(currentSet);

      dfa[currentState] = { nodes: {}, final: false };

      // Check if the current state set contains any final state from NFA
      dfa[currentState].final = Array.from(currentSet).some(
        (state) => nfa[state].final
      );

      for (const symbol of alphabet) {
        const nextSet = getNextStateSet(currentSet, symbol);
        if (nextSet.size > 0) {
          const nextState = setToString(nextSet);
          dfa[currentState].nodes[symbol] = new Set([nextState]);

          if (!processedStates.some((set) => setToString(set) === nextState)) {
            stateQueue.push(nextSet);
          }
        } else {
          // Transition to dead state if next set is empty
          dfa[currentState].nodes[symbol] = new Set([DEAD_STATE]);
        }
      }
    }

    this.result = dfa;
    return this;
  }
  //https://www.irjet.net/archives/V10/i1/IRJET-V10I194.pdf
  /**
   * Minimize a Deterministic Finite Automaton (DFA).
   * 1. Convert the NFA (if applicable) to a DFA.
   * 2. Extract the alphabets from the DFA transitions.
   * 3. Partition states into two sets: final states and non-final states.
   * 4. While there are partitions to process:
   *    a. Pop a partition from the work list.
   *    b. For each symbol in the alphabets:
   *       i. Calculate the inverse transitions for that symbol.
   *       ii. Identify states that can transition into the current partition.
   *       iii. Split the current partition if necessary:
   *            - One subset for states that transition into the partition.
   *            - Another subset for states that do not transition into the partition.
   *    c. Update the partitions and work list:
   *       i. Replace the current partition with the two new subsets.
   *       ii. Add these new subsets to the work list.
   *    d. Break the loop to restart with the updated work list.
   * 5. Construct the minimized DFA using the final partitions.
   * 6. Rename and update the start state in the minimized DFA.
   * 7. Return the minimized DFA.
   **/

  minimizeDFA() {
    const dfa: FAGraph = this.toDFA().result;
    const alphabet: Set<string> = new Set();
    const result: FAGraph = {};

    //Extract the alphabets from the DFA transitions.
    for (const state in dfa) {
      for (const symbol in dfa[state].nodes) {
        alphabet.add(symbol);
      }
    }

    //Partition states into two sets: final states and non-final states.
    const finalStates = new Set(
      Object.keys(dfa).filter((state) => dfa[state].final)
    );
    const nonFinalStates = new Set(
      Object.keys(dfa).filter((state) => !dfa[state].final)
    );

    const partitions = [finalStates, nonFinalStates].filter(
      (set) => set.size > 0
    );
    const workList = [...partitions];

    while (workList.length > 0) {
      const partition = workList.pop()!;

      for (const symbol of alphabet) {
        const inverseTrans = this.getInverseTransitions(dfa, symbol);
        const splitters = new Set<string>();
        //The splitters set contains the states that transition into the current partition on a given input symbol.
        for (const state of partition) {
          if (inverseTrans[state]) {
            for (const fromState of inverseTrans[state]) {
              splitters.add(fromState);
            }
          }
        }

        for (let i = 0; i < partitions.length; i++) {
          const currentPartition = partitions[i];

          const intersection = new Set(
            [...currentPartition].filter((x) => splitters.has(x))
          );
          const difference = new Set(
            [...currentPartition].filter((x) => !splitters.has(x))
          );

          if (intersection.size > 0 && difference.size > 0) {
            partitions.splice(i, 1, intersection, difference);
            workList.push(intersection);
            workList.push(difference);
            break;
          }
        }
      }
    }

    const minimizedDFA: FAGraph = {};
    const setToString = (set: Set<string>): string => Array.from(set).sort().join('|');

  for (const partition of partitions) {
    const partitionState = setToString(partition);
    const representativeState = partition.values().next().value;

    minimizedDFA[partitionState] = {
      nodes: {},
      final: dfa[representativeState].final,
    };

    for (const symbol of alphabet) {
      const nextState = dfa[representativeState].nodes[symbol]
        ?.values()
        .next().value;
      if (nextState) {
        const nextPartition = partitions.find((p) => p.has(nextState));
        if (nextPartition) {
          minimizedDFA[partitionState].nodes[symbol] = new Set([
            setToString(nextPartition)
          ]);
        }
      }
    }
  }

  // Handle the start state
  const startPartition = partitions.find((partition) => partition.has('S'));
  if (startPartition) {
    const oldStartState = setToString(startPartition);
    if (oldStartState !== 'S') {
      // Rename the start state to 'S'
      minimizedDFA['S'] = minimizedDFA[oldStartState];
      delete minimizedDFA[oldStartState];

      // Update all transitions to the new 'S' state
      for (const state in minimizedDFA) {
        for (const symbol in minimizedDFA[state].nodes) {
          if (minimizedDFA[state].nodes[symbol].has(oldStartState)) {
            minimizedDFA[state].nodes[symbol].delete(oldStartState);
            minimizedDFA[state].nodes[symbol].add('S');
          }
        }
      }
    }
  }

  this.result = minimizedDFA;
  return this;
}
  /**
   * Get the inverse transitions for a given symbol in a DFA.
   * 1. Initialize an empty map `inverse` to store the inverse transitions.
   * 2. For each state in the DFA (`fromState`):
   *    a. For each state (`toState`) that `fromState` transitions to on the given symbol:
   *       i. If `toState` is not already in `inverse`, add it with an empty set.
   *       ii. Add `fromState` to the set of states in `inverse` that transition to `toState`.
   * 3. Return the `inverse` map.
   **/

  private getInverseTransitions(
  dfa: FAGraph,
  symbol: string
): Record<string, Set<string>> {
  const inverse: Record<string, Set<string>> = {};
  for (const fromState in dfa) {
    const toStates = dfa[fromState].nodes[symbol] || new Set<string>();
    for (const toState of toStates) {
      if (!inverse[toState]) {
        inverse[toState] = new Set<string>();
      }
      inverse[toState].add(fromState);
    }
  }
  return inverse;
}

export {
  RegularGrammarLexer,
  RegularGrammarParser,
  RegularGrammarSemanticAnalyzer,
  RegularGrammar,
  FAGraph,
};
