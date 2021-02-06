import { ParseTree, SymbolType, Token, CompileError } from './types';

class SemanticAnalyzer {
  parseTree: ParseTree;
  nonTerminals: Set<string>;

  constructor(parseTree: ParseTree) {
    this.parseTree = parseTree;
    this.nonTerminals = new Set();
  }

  static inorder(root: ParseTree, cb: (root: ParseTree) => void) {
    if (!root) return;

    if (root.body) {
      for(let i=0; i < root.body.length-1; i++) {
        this.inorder(root.body[i] as ParseTree, cb);
      }
    }

    cb(root);

    if (root.body) {
      this.inorder(root.body[root.body.length-1] as ParseTree, cb);
    }
  }

  /**
   * Finds Undeclared non terminals in the program.
   * 
   * Creates a set "declared" of all declared terminals by inorder traversal of parse tree.
   * Then in another inorder traversal, it checks whether there is any reference
   * of a non-terminal not in the above set.
   */
  private checkUndeclaredNonTerminals(): CompileError[] {
    const declared: Set<string> = new Set();
    const undeclared: Record<string, Token> = {};

    SemanticAnalyzer.inorder(this.parseTree, (root) => {
      if (root.type === 'Statement' && root.body.length) {
        const nonTerminalNode = root.body[0] as ParseTree;
        if (nonTerminalNode.type === SymbolType.State) {
          declared.add((nonTerminalNode.body[0] as Token).value);
        }
      }
    });

    SemanticAnalyzer.inorder(this.parseTree, (root) => {
      if (root.type === SymbolType.State) {
        const token = root.body[0] as Token;
        if (!declared.has(token.value)) {
          undeclared[`Undeclared ${token.value}`] = token;
        }
      }
    });

    return Object.values(undeclared)
      .map((token) => ({ type: 'Error', message: `${token.value} is undeclared` }));
  }

  /**
   * Finds unreachable non-terminals in the parse tree and returns them as warnings.
   * 
   * Uses DFS to construct a graph of non-terminals leading to other non-terminals.
   * Then checks the graph if some non-terminals are disconnected making them "unreachable".
   */
  private checkUnreachable(): CompileError[] {
    const graph: Record<string, { nodes: Set<string>, visited: boolean }> = {};

    // Uses DFS to contruct a graph of non-terminals leading to adjacent non-terminals
    const dfs = (root: ParseTree, context: Token) => {
      if (!root) return;

      if (root.type === SymbolType.State) {
        const token = root.body[0] as Token;
        graph[context.value].nodes.add(token.value);
      }

      if (root.body) {
        const isStatement = root.type === 'Statement';

        // If new statement is found, update the context and add it to graph as a vertex
        const nextContext = isStatement && root.body[0] ? (root.body[0] as ParseTree).body[0] as Token : context;

        if (isStatement) {
          graph[nextContext.value] = {
            nodes: new Set(),
            visited: false,
          };
        }

        /**
         * If the current root is of type statement,
         * then ignore the first child of it as it will be a non-terminal that
         * is a part of context, not a part of production itself.
         */
        for(let i = Number(isStatement); i < root.body.length; i++) {
          dfs(root.body[i] as ParseTree, nextContext);
        }
      }
    };

    // Traverses the adjacent nodes in the graph
    const traverseConnected = (curVertex: string) => {
      if (!graph[curVertex]) return;
      if (graph[curVertex].visited) return;

      graph[curVertex].visited = true;
      graph[curVertex].nodes.forEach(traverseConnected);
    };

    dfs(this.parseTree, null);

    // Start traversal from start state 'S'
    traverseConnected('S');

    return Object.entries(graph)
      .filter(([, { visited }]) => !visited)
      .map(([vertex]) => ({ type: 'Warning', message: `${vertex} is unreachable` }));
  }

  analyze(): CompileError[] {
    const undeclared = this.checkUndeclaredNonTerminals();
    const unreachable = this.checkUnreachable();
    
    return [...undeclared, ...unreachable];
  }
}

export default SemanticAnalyzer;
