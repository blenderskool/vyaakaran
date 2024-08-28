import { SimplifiedGrammarRepresentation } from '../utils';
import { ParseTree, SymbolType, CompileError } from '../types';

class SemanticAnalyzer {
  protected parseTree: ParseTree;
  protected grammar: SimplifiedGrammarRepresentation;

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
    const declared: Set<string> = new Set(
      this.grammar.rules.map(({ lhs }) => lhs),
    );
    const undeclared: Set<string> = new Set();

    this.grammar.rules.map(({ rhs }) => {
      rhs.forEach((token) => {
        if (token.type[1] !== SymbolType.State) return;

        if (!declared.has(token.value)) {
          undeclared.add(token.value);
        }
      });
    });

    const errors: CompileError[] = [...undeclared].map((nonterminal) => ({
      type: 'Error',
      message: `${nonterminal} is not defined`,
    }));

    if (!declared.has('S')) {
      errors.push({
        type: 'Error',
        message: `Start symbol 'S' is not defined`,
      });
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
    const graph: Record<string, { nodes: Set<string>; visited: boolean }> = {};

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
      .map(([vertex]) => ({
        type: 'Warning',
        message: `${vertex} is unreachable`,
      }));
  }

  // Check cyclic Dependencies from production.
  private checkCyclicDependencies(): CompileError[] {
    const graph: Record<string, Set<string>> = {};
    const visited: Set<string> = new Set();
    const recStack: Set<string> = new Set();
    const cycles: string[][] = [];

    // Build the graph
    this.grammar.rules.forEach(({ lhs, rhs }) => {
      if (!graph[lhs]) graph[lhs] = new Set();
      rhs.forEach((token) => {
        if (token.type[1] === SymbolType.State) {
          graph[lhs].add(token.value);
        }
      });
    });

    /**
     * Detects cyclic dependencies in a directed graph using Depth-First Search (DFS).
     *
     * 1. Initialize Data Structures:
     *    a. Create a `graph` to represent the directed graph with nodes and edges.
     *    b. Initialize `visited` to track nodes that have been processed.
     *    c. Initialize `recStack` to track nodes currently in the recursion stack (for cycle detection).
     *    d. Initialize `cycles` to store detected cycles.
     *
     * 2. Define Cycle Detection Function:
     *    a. Function `detectCycle(node, path = [])`:
     *       - If the node is not in `visited`:
     *         - Add `node` to `visited` and `recStack`.
     *         - Add `node` to `path`.
     *         - For each neighbor of the `node`:
     *           - If the neighbor is not in `visited`:
     *             - Recursively call `detectCycle(neighbor, [...path])`.
     *             - If a cycle is detected in the recursive call, return true.
     *           - If the neighbor is in `recStack`:
     *             - Find the start of the cycle in `path`.
     *             - Add the detected cycle to `cycles`.
     *             - Return true.
     *         - Remove `node` from `recStack` and `path` (backtrack).
     *       - Return false.
     *
     * 3. Detect Cycles for All Nodes:
     *    a. For each node in the `graph`:
     *       - If the node is not in `visited`:
     *         - Call `detectCycle(node)` to start cycle detection.
     *
     * 4. Return Detected Cycles:
     *    - Return the list of `cycles` or use it to generate warnings/errors as needed.
     */
    const detectCycle = (node: string, path: string[] = []): boolean => {
      if (!visited.has(node)) {
        visited.add(node);
        recStack.add(node);
        path.push(node);

        for (const neighbor of graph[node] || []) {
          if (!visited.has(neighbor) && detectCycle(neighbor, [...path])) {
            return true;
          } else if (recStack.has(neighbor)) {
            const cycleStart = path.indexOf(neighbor);
            cycles.push(path.slice(cycleStart));
            return true;
          }
        }
      }

      recStack.delete(node);
      return false;
    };

    // Detect cycles starting from each node
    Object.keys(graph).forEach((node) => {
      if (!visited.has(node)) {
        detectCycle(node);
      }
    });

    // Create warnings for all detected cycles
    const warnings: CompileError[] = cycles.map((cycle) => ({
      type: 'Warning' as const,
      message: `Cyclic dependency detected: ${cycle.join(' → ')} → ${cycle[0]}`,
    }));

    return warnings;
  }

  analyze(): CompileError[] {
    const undeclared = this.checkUndeclaredNonTerminals();
    const unreachable = this.checkUnreachable();
    const cyclicDependencies = this.checkCyclicDependencies();
    return [...undeclared, ...unreachable, ...cyclicDependencies];
  }
}

export default SemanticAnalyzer;
