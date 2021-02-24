import { SimplifiedGrammarRepresentation } from '../utils';
import { ParseTree, SymbolType, Token, CompileError, TokenType } from './types';

class SemanticAnalyzer {
  private parseTree: ParseTree;
  private grammar: SimplifiedGrammarRepresentation;

  constructor(parseTree: ParseTree) {
    this.parseTree = parseTree;
    this.grammar = new SimplifiedGrammarRepresentation(parseTree);
  }

  /**
   * Finds Undeclared non terminals in the program.
   * 
   * Creates a set "declared" of all declared terminals by inorder traversal of parse tree.
   * Then in another inorder traversal, it checks whether there is any reference
   * of a non-terminal not in the above set.
   */
  private checkUndeclaredNonTerminals(): CompileError[] {
    const declared: Set<string> = new Set(this.grammar.rules.map(({ lhs }) => lhs));
    const undeclared: Set<string> = new Set();

    this.grammar.rules.map(({ rhs }) => {
      rhs.forEach((token) => {
        if (token.type[1] !== SymbolType.State) return;

        if (!declared.has(token.value)) {
          undeclared.add(token.value);
        }
      });
    });

    const errors: CompileError[] = [...undeclared].map((nonterminal) => ({ type: 'Error', message: `${nonterminal} is not defined` }));

    if (!declared.has('S')) {
      errors.push({ type: 'Error', message: `Start symbol 'S' is not defined` })
    }

    return errors;
  }

  /**
   * Finds unreachable non-terminals in the parse tree and returns them as warnings.
   * 
   * Uses DFS to construct a graph of non-terminals leading to other non-terminals.
   * Then checks the graph if some non-terminals are disconnected making them "unreachable".
   */
  private checkUnreachable(): CompileError[] {
    const graph: Record<string, { nodes: Set<string>, visited: boolean }> = {};

    this.grammar.rules.forEach(({ lhs, rhs }) => {
      if (!graph[lhs]) {
        graph[lhs] = { nodes: new Set(), visited: false };
      }

      rhs.forEach((token) => {
        if (token.type[1] === SymbolType.State) {
          graph[lhs].nodes.add(token.value);
        }
      });
    });

    // Traverses the adjacent nodes in the graph
    const traverseConnected = (curVertex: string) => {
      if (!graph[curVertex]) return;
      if (graph[curVertex].visited) return;

      graph[curVertex].visited = true;
      graph[curVertex].nodes.forEach(traverseConnected);
    };

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
