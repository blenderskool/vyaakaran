import { SymbolType, Token } from '../../regular-grammar/types';
import { GrammarRule, SimplifiedGrammarRepresentation } from '../../utils';

type PredectiveSets = Record<string, Set<string>>;

/**
 * Most of the algorithm for calculating first and follow sets have been
 * referred from https://github.com/MikeDevice/first-follow
 */
function collectSet(firstSets: PredectiveSets, initialSet: Set<string>, items: Token[], additionalSet: Set<string>) {
  let set = new Set(initialSet);

  items.every((item, index) => {
    if (item.type[1] === SymbolType.State) {
      set = new Set([ ...set, ...[...firstSets[item.value]].filter((setItem) => setItem !== SymbolType.Empty) ]);

      if (firstSets[item.value].has(SymbolType.Empty)) {
        if (items[index + 1]) return true;
        set = new Set([ ...set, ...additionalSet ]);
      }
    } else {
      set.add(item.value);
    }
  });

  return set;
}

function findFirstSets(grammar: SimplifiedGrammarRepresentation): PredectiveSets {
  const firstSets: PredectiveSets = {};
  grammar.rules.forEach(({ lhs }) => {
    firstSets[lhs] = new Set();
  });

  let done = false;

  do {
    done = true;

    grammar.rules.forEach(({ lhs, rhs }) => {
      const set = new Set([ ...firstSets[lhs], ...collectSet(firstSets, firstSets[lhs], rhs, new Set([ SymbolType.Empty ])) ]);

      if (firstSets[lhs].size !== set.size) {
        firstSets[lhs] = set;
        done = false;
      }
    });
  } while (!done);

  return firstSets;
}

function findFollowSets(grammar: SimplifiedGrammarRepresentation, firstSets: PredectiveSets = null): PredectiveSets {
  firstSets = firstSets ?? findFirstSets(grammar);
  const followSets: PredectiveSets = {};

  grammar.rules.forEach(({ lhs }) => {
    followSets[lhs] = new Set(lhs === 'S' ? [SymbolType.Dollar] : []);
  });

  let done = false;
  
  do {
    done = true;

    grammar.rules.forEach(({ lhs, rhs }) => {
      rhs.forEach((token, i) => {
        if (token.type[1] !== SymbolType.State) return;

        const set = new Set([
          ...followSets[token.value],
          ...i + 1 < rhs.length
            ? collectSet(firstSets, followSets[token.value], rhs.slice(i + 1), followSets[lhs])
            : followSets[lhs],
        ]);

        if (followSets[token.value].size !== set.size) {
          followSets[token.value] = set;
          done = false;
        }
      });
    });
  } while (!done);

  return followSets;
}


function findLL1Table(grammar: SimplifiedGrammarRepresentation) {
  const firstSets = findFirstSets(grammar);
  const follow = findFollowSets(grammar, firstSets);

  const nonterminals = grammar.nonterminals;
  const columns = Object.fromEntries([...grammar.terminals, SymbolType.Dollar].map((term, i) => [term, i]));
  
  const parseTable: string[][][] = nonterminals.map(() => Object.keys(columns).map(() => []));

  nonterminals.forEach((nonterminal, i) => {
    const gen = grammar.trav(nonterminal);
    let it = gen.next();
    while (!it.done) {
      const rule = it.value as GrammarRule;

      if (rule.rhs[0].type[1] === SymbolType.Empty) {
        follow[nonterminal].forEach((terminal) => {
          parseTable[i][columns[terminal]].push(rule.toString());
        });
      } else {
        const firstSet = [...collectSet(firstSets, new Set(), rule.rhs, new Set([ SymbolType.Empty ]))];

        firstSet.forEach((first) => {
          if (first === SymbolType.Empty) return;

          parseTable[i][columns[first]].push(rule.toString());
        });
      }

      it = gen.next();
    }
  });

  return { parseTable, columns };
}

export { collectSet, findFirstSets, findFollowSets, findLL1Table, PredectiveSets };
