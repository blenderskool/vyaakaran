import clone from 'just-clone';
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

interface HashSetElement {
  hash: () => string;
  toString: () => string;
};

class HashSet<T extends HashSetElement> {
  protected obj: Record<string|number, T>;
  
  constructor() {
    this.obj = {};
  }

  add(item: T) {
    this.obj[item.hash()] = item;
  }
  
  list(): T[] {
    return Object.values(this.obj);
  }

  clear() {
    this.obj = {};
  }

  has(item: T): boolean {
    return this.obj[item.hash()] !== undefined;
  }

  toString(): string {
    return this.list().map((item) => item.toString()).join('\n');
  }
}

class OrderedHashSet<T extends HashSetElement> extends HashSet<T> {
  private order: (string|number)[];
  
  constructor() {
    super();
    this.order = [];
  }

  add(item: T) {
    const hash = item.hash();
    if (this.obj[hash] !== undefined) return;

    this.obj[hash] = item;
    if (this.order.length === 0 || hash <= this.order[0]) {
      this.order.unshift(hash);
    } else if (this.order[this.order.length - 1] < hash) {
      this.order.push(hash);
    } else {
      for(let i=0; i < this.order.length - 1; ++i) {
        if (this.order[i] < hash && hash < this.order[i+1]) {
          this.order.splice(i+1, 0, hash);
          break;
        }
      }
    }
  }
  
  list(): T[] {
    return this.order.map((hash) => this.obj[hash]);
  }

  unorderedList(): T[] {
    return super.list();
  }

  clear() {
    super.clear();
    this.order = [];
  }
}

class GrammarRule {
  lhs: string;
  rhs: Token[];

  constructor(lhs: string, rhs: Token[]) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString() {
    return `${this.lhs} ${SymbolType.Follow} ${this.rhs.map((t) => t.value).join(' ')}${SymbolType.Dot}`;
  }
}

/**
 * A minimized representation of the grammar constructed from the parse tree.
 * It is useful in implementing some conversion algorithms.
 */
class SimplifiedGrammarRepresentation {
  rules: GrammarRule[];
  private nullNonTerminals: Set<string>;

  constructor(parseTree: ParseTree) {
    this.constructRules(parseTree);
    this.computeNonTerminals();
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
        this.rules.push(new GrammarRule(context.value, termsStack));
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

  private computeNonTerminals() {
    this.nullNonTerminals = new Set();

    let nullLength = 0;
    do {
      nullLength = this.nullNonTerminals.size;
      this.rules.forEach(rule => {
        if (rule.rhs[0].type[1] === SymbolType.Empty || rule.rhs.every((token) => this.nullNonTerminals.has(token.value))) {
          this.nullNonTerminals.add(rule.lhs);
        }
      });
    } while(nullLength !== this.nullNonTerminals.size);
  }

  isNull(nonterminal: string) {
    return this.nullNonTerminals.has(nonterminal);
  }

  addRule(rule: GrammarRule) {
    this.rules.push(rule);
    this.computeNonTerminals();
  }

  *trav(nonterminal: string) {
    for(let i=0; i < this.rules.length; i++) {
      if (this.rules[i].lhs === nonterminal) {
        yield this.rules[i];
      }
    }
  }

  get terminals() {
    return [...new Set(this.rules.flatMap(({ rhs }) => rhs.filter(token => token.type[1] === SymbolType.Literal).map(token => token.value)))];
  }

  get nonterminals() {
    return [...new Set(this.rules.flatMap(({ lhs }) => lhs))];
  }
}


class State {
  nonterminal: string;
  expression: Token[];
  dot: number;

  constructor(nonterminal, expression, dot = 0) {
    this.nonterminal = nonterminal;
    this.expression = expression;
    this.dot = dot;
  }

  get finished() {
    return this.dot >= this.expression.length;
  }

  get symbol() {
    return this.finished ? null : this.expression[this.dot];
  }

  get symbol_is_nonterminal() {
    return this.symbol && this.symbol.type[1] === SymbolType.State;
  }

  get symbol_is_null() {
    return this.symbol && this.symbol.type[1] === SymbolType.Empty;
  }

  get shift() {
    return new State(this.nonterminal, this.expression, this.dot + 1);
  }

  hash() {
    return `${this.nonterminal} ${SymbolType.Follow} ${this.expression.slice(0, this.dot).map(t => t.value).join(' ')}.${this.expression.slice(this.dot).map(t => t.value).join(' ')}`;
  }

  toString() {
    return this.hash();
  }
}

function getGeneratorReturn<T, TReturn, TNext>(generator: Generator<T, TReturn, TNext>) {
  let currentValue = generator.next();
  while(!currentValue.done) {
    currentValue = generator.next(); 
  }

  return currentValue.value;
}

class IterateGenerator<T, TReturn, TNext> {
  private generator: Generator<T, TReturn, TNext>;
  private history: IteratorResult<T, TReturn>[];
  private position: number;

  constructor(generator: Generator<T, TReturn, TNext>) {
    this.generator = generator;
    this.history = [];
    this.position = -1;
  }

  next() {
    if (this.position === this.history.length - 1) {
      const currentValue = this.generator.next();
      if (currentValue.done) return undefined;

      this.history.push(clone(currentValue));
    }

    ++this.position;
    return this.history[this.position];
  }

  prev(): IteratorResult<T, TReturn> | undefined {
    if (this.position <= 0) {
      return undefined;
    }

    --this.position;
    return this.history[this.position];
  }
}

export { isUpperAlpha, HashSet, OrderedHashSet, SimplifiedGrammarRepresentation, GrammarRule, State, IterateGenerator, getGeneratorReturn };
