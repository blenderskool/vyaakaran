// RegularGrammar.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { RegularGrammar } from '../dist/index';

describe('RegularGrammar', () => {
  let grammar: RegularGrammar;

  beforeEach(() => {
    const program = `
      A -> xB
      A -> x
      A -> Bx
    `;
    grammar = new RegularGrammar(program);
  });

  it('parses the program', () => {
    grammar.parse();

    // // console.log(grammar);
    // expect(grammar.result).toBeDefined();
    // expect(grammar.errors).toHaveLength(0);
  });
});
