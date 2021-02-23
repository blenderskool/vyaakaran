import { ParseTree, SymbolType, Token } from './regular-grammar/types';

/**
 * Checkes whether the first character in the parameter
 * is an upper case alphabet
 * @param char Character to check
 */
function isUpperAlpha(char: string) {
  const charCode = char.charCodeAt(0);

  return charCode >= 65 && charCode <= 90;
}

class HashSet {
  private obj: object;
  
  constructor() {
    this.obj = {};
  }

  add(item: any) {
    this.obj[item.hash()] = item;
  }
  
  list() {
    return Object.values(this.obj);
  }

  clear() {
    this.obj = {};
  }

  has(item: any) {
    return this.obj[item.hash()] !== undefined;
  }
}

/**
 * A minimized representation of the grammar constructed from the parse tree.
 * It is useful in implementing some conversion algorithms.
 */
class SimplifiedGrammarRepresentation {
  rules: [string, Token[]][];
  private nullNonTerminals: Set<string>;

  constructor(parseTree: ParseTree) {
    this.constructRules(parseTree);
    this.nullNonTerminals = new Set();

    let nullLength = 0;
    do {
      nullLength = this.nullNonTerminals.size;
      this.rules.forEach(rule => {
        if (rule[1].find((token) => token.type[1] === SymbolType.Empty || this.nullNonTerminals.has(token.value))) {
          this.nullNonTerminals.add(rule[0]);
        }
      });
    } while(nullLength !== this.nullNonTerminals.size);
  }


  private constructRules(parseTree: ParseTree) {
    this.rules = [];

    /**
     * Creates an array of all symbols occuring in a "Term".
     * "Term" is defined as RHS of a production rule.
     */
    const termsDFS = (root: ParseTree, termsStack: Token[]) => {
      if (!root) return;
      if (!root.body) return;

      if (root.type === SymbolType.Empty) {
        termsStack.push({ ...root.body[0] as Token, value: SymbolType.Empty });
      } else if (root.type === SymbolType.Literal || root.type === SymbolType.State) {
        termsStack.push(root.body[0] as Token);
      }

      for(let i = 0; i < root.body.length; i++) {
        termsDFS(root.body[i] as ParseTree, termsStack);
      }
    };

    // Main DFS traversal to find all production rules
    const dfs = (root: ParseTree, context: Token) => {
      if (!root) return;

      if (root.type === 'Term' || root.type === SymbolType.Empty) {
        const termsStack: Token[] = [];
        termsDFS(root, termsStack);
        this.rules.push([context.value, termsStack]);
      } else if (root.body) {
        // LHS of production gets updated here if encountered for new productions
        const isStatement = root.type === 'Statement';
        const nextContext = isStatement && root.body[0] ? (root.body[0] as ParseTree).body[0] as Token : context;

        for(let i = Number(isStatement); i < root.body.length; i++) {
          dfs(root.body[i] as ParseTree, nextContext);
        }
      }
    };

    dfs(parseTree, null);
  }

  isNull(nonterminal: string) {
    return this.nullNonTerminals.has(nonterminal);
  }

  *trav(nonterminal: string) {
    for(let i=0; i < this.rules.length; i++) {
      if (this.rules[i][0] === nonterminal) {
        yield this.rules[i];
      }
    }
  }
}

export { isUpperAlpha, HashSet, SimplifiedGrammarRepresentation };
