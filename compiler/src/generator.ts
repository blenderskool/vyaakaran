import { SymbolType } from './regular-grammar/types';
import { SimplifiedGrammarRepresentation } from './utils';

const MAX_ITER = 1e3;

function weighted_choice(weights: number[]): number {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  let rand = Math.random() * sum;

  for(let i=0; i < weights.length; ++i) {
    rand -= weights[i];
    if (rand < 0) {
      return i;
    }
  }

  return weights.length - 1;
}

/**
 * Simple Random String generator from a grammar.
 * 
 * Referred from https://eli.thegreenplace.net/2010/01/28/generating-random-sentences-from-a-context-free-grammar
 */
class RandomStringGenerator {
  private grammar: SimplifiedGrammarRepresentation;

  constructor(grammar: SimplifiedGrammarRepresentation) {
    this.grammar = grammar;
  }

  /**
   * Generates a random string that is part of the language defined by the grammar.
   * @param symbol Start symbol of the grammar
   * @param cfactor Convergence factor. Higher values would lead to deeper recursions and hence longer strings. Must be between 0 and 1 
   * @param pcount Map that keeps track of the number of times each production was derived
   * @returns random string generated
   */
  generate(symbol = 'S', cfactor = 0.25, pcount = {}) {
    let sentence = '';

    const rules = [...this.grammar.trav(symbol)];

    const weights = rules.map((rule) => {
      const count = pcount[rule.toString()];
      if (count == undefined)
        return 1.0;
      else
        return Math.pow(cfactor, count);
    });

    const rand_prod = rules[weighted_choice(weights)];
    const rand_prod_hash = rand_prod.toString();
    if (pcount[rand_prod_hash] === undefined) {
      pcount[rand_prod_hash] = 0;
    }
    ++pcount[rand_prod_hash];

    rand_prod.rhs.forEach((symbol) => {
      if (symbol.type[1] === SymbolType.State) {
        sentence += this.generate(symbol.value, cfactor, pcount);
      } else if (symbol.type[1] === SymbolType.Literal) {
        sentence += symbol.value + ' ';
      }
    });

    --pcount[rand_prod_hash];
    return sentence;
  }

  /**
   * Generates a set atmost [count] number of unique strings from the grammar.
   * @param count Maximum number of strings to generate
   * @param args Other arguments passed to generator
   * @returns set of generated strings
   */
  generateAtMost(count = 10, ...args) {
    const sentences: Set<string> = new Set();
    let iter = 0;

    while(sentences.size < count && iter < MAX_ITER) {
      sentences.add(this.generate(...args).trimEnd());
      ++iter;
    }

    return sentences;
  }
}

export { RandomStringGenerator };
