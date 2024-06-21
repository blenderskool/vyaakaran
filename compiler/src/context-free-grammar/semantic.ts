import { RegularGrammarSemanticAnalyzer } from '../regular-grammar';
import { CompileError, SymbolType } from '../types';
import { GrammarRule } from '../utils';

class SemanticAnalyzer extends RegularGrammarSemanticAnalyzer {
  
  /**
   * This function checks if (in)direct left recursion exists in the grammar.
   * 
   * The definition of indirect left recursion from Wikipedia:
   * A0 -> β0 A1 α0
   * A1 -> β1 A2 α1
   * ...
   * An -> βn A0 αn
   * 
   * where β0, β1, ..., βn are sequences that can yield empty string.
   * A0 =>+ A0 αn ... α1 α0 this gives A0 as leftmost symbol
   * 
   * The algorithm builds a tree of all leftmost nullable non-terminals till a non-null non-terminal is encountered
   * If the non-terminal has already been realized before, it indicates a cycle and possible left recursion.
   * The current implementation only finds a single set of symbols involved in left recursion and not all the left recursive sets.
   * 
   * @returns Warning with a message including symbols involves in left recursion
   */
  checkLeftRecursion(): CompileError {
    const queue = ['S'];
    /**
     * backRef is a key value pair of a nonterminal and the parent nonterminal that realized it.
     * Note the value can only hold a single parent of a particular symbol where in reality, a non-terminal
     * may be derived from multiple parent productions.
     */
    const backRef: Record<string, string> = {};
    const visited: Set<string> = new Set();
    let cyclicSet: Set<string> = null;

    while(queue.length) {
      const gen = this.grammar.trav(queue.shift());
      let it = gen.next();

      while(!it.done) {
        const { lhs, rhs } = it.value as GrammarRule;

        for(const token of rhs) {
          if (token.type[1] !== SymbolType.State) break;

          if (!visited.has(lhs)) {
            visited.add(lhs);
          }

          backRef[token.value] = lhs;

          if (!visited.has(token.value)) {
            queue.push(token.value);
          } else {
            cyclicSet = new Set([ token.value, lhs ]);
            let cur = lhs;

            while(cur !== token.value) {
              cur = backRef[cur];
              cyclicSet.add(cur);
            }
          }

          if (!this.grammar.isNull(token.value)) break;
        }

        it = gen.next();
      }
    }

    if (!cyclicSet) return null;

    return {
      type: 'Warning',
      message: `Left recursion exists in ${[...cyclicSet].join(', ')}`,
    };
  }

  analyze(): CompileError[] {
    const errors = super.analyze();
    const leftRecursion = this.checkLeftRecursion();

    return [...errors, ...(leftRecursion ? [ leftRecursion ] : []) ];
  }
}

export default SemanticAnalyzer;
