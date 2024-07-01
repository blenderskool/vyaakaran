import { it } from "vitest";
import { describe } from "vitest";

import { ContextFreeGrammar } from "../dist";
import { beforeEach } from "vitest";
import { expect } from "vitest";
import { SimplifiedGrammarRepresentation } from "../dist/utils";
import {
  findFirstSets,
  findFollowSets,
} from "../dist/context-free-grammar/algorithms/top-down-parsing";

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

  it("Semantic Analysis", () => {
    grammar.parse().semanticAnalysis();
    expect(grammar.errors).toHaveLength(0);
    expect(grammar.warnings).toHaveLength(0);
    expect(grammar["grammar"]).toBeInstanceOf(SimplifiedGrammarRepresentation);
  });

  it("Find First Sets", () => {
    grammar.parse().semanticAnalysis();
    const firstSets = grammar.findFirstSets();
    const actualFirstSets = {
      S: new Set(['0', '1', '#']),
      A: new Set(['0', '1', '#'])
    };

    expect(firstSets).toBeDefined();
    expect(firstSets).toMatchObject(actualFirstSets)
  });

  it("Find Follow Sets", () => {
    grammar.parse().semanticAnalysis();
    
    const followSets = grammar.findFollowSets();
    const actualFollowSets = {
      S: new Set(['$']),
      A: new Set(['$'])
    };
    expect(followSets).toBeDefined();
    expect(followSets).toMatchObject(actualFollowSets);
  });

  it("Conversion To LL1", () => {
    grammar.parse().semanticAnalysis().toLL1();
    expect(grammar.result["conflicts"]).toBeDefined();
    expect(grammar.result["conclusions"]).toBeDefined();
    expect(grammar.result["conclusions"]).not.toHaveLength(0);
  });
  
  it("Conversion to LR(0)", () => {
    grammar.parse().semanticAnalysis().toLR0();
    
    expect(grammar.result["actionTable"]).toBeDefined();
    expect(grammar.result["conclusions"]).toBeDefined();
    expect(grammar.result["conclusions"]).not.toHaveLength(0);
  });
  
  it("Conversion to SLR(1)", () => {
    grammar.parse().semanticAnalysis().toSLR1();
    
    expect(grammar.result["actionTable"]).toBeDefined();
    expect(grammar.result["conclusions"]).toBeDefined();
    expect(grammar.result["conclusions"]).not.toHaveLength(0);
  });
  
  it("Conversion to LR(1)", () => {
    grammar.parse().semanticAnalysis().toLR1();
    
    expect(grammar.result["actionTable"]).toBeDefined();
    expect(grammar.result["conclusions"]).toBeDefined();
    expect(grammar.result["conclusions"]).not.toHaveLength(0);
  });
  
  it("Conversion to LALR(1)", () => {
    grammar.parse().semanticAnalysis().toLALR1();
    
    expect(grammar.result["actionTable"]).toBeDefined();
    expect(grammar.result["conclusions"]).toBeDefined();
    expect(grammar.result["conclusions"]).not.toHaveLength(0);
  });
});
