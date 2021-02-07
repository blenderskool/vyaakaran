import RegularGrammarLexer from './lexer';
import RegularGrammarParser from './parser';
import RegularGrammarSemanticAnalyzer from './semantic';
import { ParseTree, CompileError, Token, SymbolType } from './types';

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
   *        3. If the production is of the form Vi -> ∈, then
   *          Vi is marked as a final state
   * 
   *        4. If the production is of the form Vi -> Vj, then
   *          a ∈ transition from Vi to Vj is added in the graph
   */
  toFA() {
    if (this.errors.length) return this;

    const graph: Record<string, { nodes: Record<string, Set<string>>, final: boolean}> = {};
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
}


export { RegularGrammarLexer, RegularGrammarParser, RegularGrammarSemanticAnalyzer, RegularGrammar };