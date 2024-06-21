import { SymbolType } from '../types';
import { randInt, shuffle, SimplifiedGrammarRepresentation } from '../utils';
import { EarleyParser } from './validator';

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
  private terminals: string[];

  constructor(grammar: SimplifiedGrammarRepresentation) {
    this.grammar = grammar;
    this.terminals = grammar.terminals;
  }

  /**
   * Generates a random string that is part of the language defined by the grammar.
   * @param symbol Start symbol of the grammar
   * @param cfactor Convergence factor. Higher values would lead to deeper recursions and hence longer strings. Must be between 0 and 1 
   * @param pcount Map that keeps track of the number of times each production was derived
   * @returns random string generated
   */
  acceptable(symbol = 'S', cfactor = 0.25, pcount = {}) {
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
        sentence += this.acceptable(symbol.value, cfactor, pcount);
      } else if (symbol.type[1] === SymbolType.Literal) {
        sentence += symbol.value + ' ';
      }
    });

    --pcount[rand_prod_hash];
    return sentence;
  }

  /**
   * Generates a set atmost [count] number of acceptable unique strings from the grammar.
   * @param count Maximum number of strings to generate
   * @param args Other arguments passed to generator
   * @returns set of generated strings
   */
  acceptableAtMost(count = 10, ...args) {
    const sentences: Set<string> = new Set();
    let iter = 0;

    while(sentences.size < count && iter < MAX_ITER) {
      sentences.add(this.acceptable(...args).trimEnd());
      ++iter;
    }

    return sentences;
  }

  /**
   * Generates a random string that *may not* be a part of the language defined by the grammar
   * using a string that is part of the language defined by the grammar.
   * @param string A string that is a part of the language defined by the grammar. It is represented as a sequence of terminals
   * @param cfactor Convergence factor. Higher values would lead to longer mutations on valid string. Must be between 0 and 1
   * @param pcount Map that keeps track of number of times each mutation was performed.
   * @returns String that *may not* be a part of the language defined. Use EarleyParser validator to validate the acceptance of the string
   */
  unacceptable(string: string[] = [], cfactor = 0.25, pcount = { ADD: 1, DELETE: 1, SHUFFLE: 1, STOP: 3 }): string[] {
    const choices = Object.entries(pcount);
    const weights = choices.map((choice) => Math.pow(cfactor, choice[1]));

    const randomIdx = weighted_choice(weights);
    const action = choices[randomIdx][0];

    switch (action) {
      case 'ADD': {
        const idx = randInt(string.length);
        string.splice(idx, 0, this.terminals[randInt(this.terminals.length)]);
        break;
      }
      case 'DELETE': {
        const idx = randInt(string.length);
        string.splice(idx, 1);
        break;
      }
      case 'SHUFFLE': {
        shuffle(string);
        break;
      }
      case 'STOP':
        return string;
      default:
        break;
    }

    ++pcount[action];
    return this.unacceptable(string, cfactor, pcount);
  }

  /**
   * Generates a set atmost [count] number of unacceptable unique strings from the grammar.
   * @param count Maximum number of strings to generate
   * @param args Other arguments passed to generator
   * @returns set of generated strings
   */
  unacceptableAtMost(count = 10, ...args) {
    const validator = new EarleyParser(this.grammar);
    const result: Set<string> = new Set();
    let iter = 0;
    
    while(result.size < count && iter < MAX_ITER) {
      const validStrings = this.acceptableAtMost(10, 'S', 0.5);

      for(const str of validStrings) {
        if (result.size >= count) break;

        const sentence = this.unacceptable(str.split(' '), ...args).join(' ');
        if (validator.isParsable(sentence) === 0) {
          result.add(sentence);
        } else {
          // Invalid string generated (probably which is acceptable with or without ambiguity)
          // Would be interesting to count number of invalids generated
        }
      }
      ++iter;
    }

    return result;
  }
}

export { RandomStringGenerator };
