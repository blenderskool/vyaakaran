import { it } from "vitest";
import { describe } from "vitest";

import { ContextFreeGrammar } from "../compiler";
import { beforeEach } from "vitest";
import { expect } from "vitest";

describe("Testing Compiler", () => {
  let grammar: ContextFreeGrammar;

  beforeEach(() => {
    const program = `
    S -> 0 1 S | 1 0 S | A.
    A -> 0 1 A | 1 0 A | #.
      `;
    grammar = new ContextFreeGrammar(program);
  });
  it("Parsing", () => {
    grammar.parse();
    expect(grammar.errors).toHaveLength(0);
    expect(grammar.parseTree).toBeDefined();
    expect(grammar.result).toBeDefined();
  });
});
