import RegularGrammarLexer from './lexer';
import RegularGrammarParser from './parser';
import RegularGrammarSemanticAnalyzer from './semantic';
import { ParseTree, CompileError, Token, SymbolType } from './types';

type FAGraph = Record<string, { nodes: Record<string, Set<string>>, final: boolean}>;

class RegularGrammar {
  program: string;
  errors: CompileError[];
  warnings: CompileError[];
  parseTree: ParseTree;
  result: any;

  constructor(program: string) {
    this.program = program;
    this.errors = [];
    this.warnings = [];
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
      const errors = new RegularGrammarSemanticAnalyzer(this.parseTree).analyze();
      this.errors.push(...errors.filter(err => err.type === 'Error'));
      this.warnings.push(...errors.filter(err => err.type === 'Warning'));
    }

    return this;
  }

  /**
   * Constructs a finite automata from the parse tree
   * Involves following steps:
   *    - Finds all "NON-TERMINAL" -> "TERMS" rules from the parse tree using DFS.
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
  toFA() {
    if (this.errors.length) return this;

    const graph: FAGraph = {};
    let midStateCnt = 0;

    /**
     * Creates an array of all symbols occuring in a "Term".
     * "Term" is defined as RHS of a production rule.
     */
    const termsDFS = (root: ParseTree, termsStack: Token[]) => {
      if (!root) return;
      if (!root.body) return;

      if (root.type === SymbolType.Literal || root.type === SymbolType.State || root.type === SymbolType.Empty) {
        const token = root.body[0] as Token;
        termsStack.push(token);
      }

      for(let i = 0; i < root.body.length; i++) {
        termsDFS(root.body[i] as ParseTree, termsStack);
      }
    };

    /**
     * Helper method to add a transition in the graph.
     * It creates an adjacency list for new nodes as they come.
     */
    const addToGraph = (from, via, to) => {
      if (!graph[from].nodes[via]) {
        graph[from].nodes[via] = new Set();
      }
      graph[from].nodes[via].add(to);
    }

    // Main DFS traversal to find all production rules
    const dfs = (root: ParseTree, context: Token) => {
      if (!root) return;

      /**
       * If a subtree of type "Term" is found in the parse tree,
       * then termDFS is performed to get all symbols associated with
       * this "Term".
       * 
       * Then the four rules are applied to add them in the graph
       */
      if (root.type === 'Term' || root.type === SymbolType.Empty) {
        const termsStack: Token[] = [];
        termsDFS(root, termsStack);

        // Add intermediate states and transitions. Required for Rule 1, 2
        let start = context.value;
        for(let i=0; i < termsStack.length-1; i++) {
          const term = termsStack[i];

          const toState = termsStack[i+1].type[1] === SymbolType.State ? termsStack[i+1].value : `_S-${++midStateCnt}`;
          addToGraph(start, term.value, toState)
          graph[start].nodes[term.value].add(toState);
          start = toState;

          if (!graph[start]) {
            graph[start] = { nodes: {}, final: false };
          }
        }

        // Rule 4
        if (termsStack.length === 1 && termsStack[0].type[1] === SymbolType.State) {
          addToGraph(context.value, '#', termsStack[0].value);
        }

        switch(termsStack[termsStack.length-1].type[1]) {
          // Rule 2 (Adding transition to _FIN state)
          case SymbolType.Literal:
            if (!graph['_FIN']){
              graph['_FIN'] = { nodes: {}, final: true };
            }
            const { value } = termsStack[termsStack.length-1];
            addToGraph(start, value, '_FIN');
            break;

          // Rule 3
          case SymbolType.Empty:
            graph[context.value].final = true;
        }

      } else if (root.body) {
        // LHS of production gets updated here if encountered for new productions
        const isStatement = root.type === 'Statement';
        const nextContext = isStatement && root.body[0] ? (root.body[0] as ParseTree).body[0] as Token : context;

        if (isStatement && !graph[nextContext.value]) {
          graph[nextContext.value] = {
            nodes: {},
            final: false,
          };
        }

        for(let i = Number(isStatement); i < root.body.length; i++) {
          dfs(root.body[i] as ParseTree, nextContext);
        }
      }

    };
    dfs(this.parseTree, null);

    this.result = graph;
    return this;
  }

  /**
   * Naive Finite Automata Optimizer
   * 
   * Optimizes the following:
   *    - Removes unreachable states (states without any incoming transitions)
   *    - TODO: Merge duplicate states (states which have same outgoing transitions)
   */
  optimizeFA() {
    const graph: FAGraph = this.result;
    let incomingNodes = new Set([ 'S' ]);

    // Construct set of all nodes that have incoming edges
    for(const from in graph) {
      for(const via in graph[from].nodes) {
        incomingNodes = new Set([ ...incomingNodes, ...graph[from].nodes[via] ]);
      }
    }

    // Remove nodes which are unreachable
    for(const from in graph) {
      if (!incomingNodes.has(from)) {
        delete graph[from];
      }
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

      for(const via in graph[root].nodes) {
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
    for(const node in graph) {
      resultGraph[node] = { nodes: {...graph[node].nodes}, final: graph[node].final };

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
        stack.forEach(([ via, to ]) => {
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

      for(let i = 0; i < root.body.length; i++) {
        dfs(root.body[i] as ParseTree);
      }
    }
    dfs(this.parseTree);

    const star = (exp) => {
      if (!exp || exp === 'ε') return 'ε';

      return exp + '*';
    }
    const concat = (a, b) => {
      if (!a || !b) return '';

      if (a === 'ε') return b;
      if (b === 'ε') return a;

      return `(${a}.${b})`;
    }

    const union = (a, b) => {
      if (!a || !b || a === b) return a || b;

      return `(${a} + ${b})`;
    };

    const nodes = Object.keys(graph);
    const B: string[] = nodes.map(i => graph[i].final ? 'ε' : '');
    const A = [];

    for(let i=0; i < nodes.length; i++) {
      A[i] = [];
      for(let j=0; j < nodes.length; j++) {
        A[i][j] = '';
        sigma.forEach((a: string) => {
          A[i][j] = union(A[i][j], graph[nodes[i]].nodes[a]?.has(nodes[j]) ? a : '');
        });
      }
    }

    for(let n = B.length-1; n >= 0; n--) {
      B[n] = concat(star(A[n][n]), B[n]);

      for(let j=0; j<n; j++) {
        A[n][j] = concat(star(A[n][n]), A[n][j]);
      }

      for(let i=0; i<n; i++) {
        B[i] = union(B[i], concat(A[i][n], B[n]));

        for(let j=0; j<n; j++) {
          A[i][j] = union(A[i][j], concat(A[i][n], A[n][j]));
        }
        
      }
    }

    this.result = B[0];
    
    return this;
  }
}


export {
  RegularGrammarLexer,
  RegularGrammarParser,
  RegularGrammarSemanticAnalyzer,
  RegularGrammar,
  FAGraph,
};