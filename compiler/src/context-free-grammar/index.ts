import RegularGrammarLexer from '../regular-grammar/lexer';
import ContextFreeGrammarParser from './parser';
import ContextFreeGrammarSemanticAnalyzer from './semantic';
import { CompilerClass, ParseTree } from '../types';
import { SimplifiedGrammarRepresentation } from '../utils';
import { findFirstSets, findFollowSets, findLALR1Table, findLL1Table, findLR0Table, findLR1Table, findSLR1Table } from './algorithms';

class ContextFreeGrammar extends CompilerClass {
  private grammar: SimplifiedGrammarRepresentation;
  result: any;

  constructor(program: string) {
    super(program);
  }

  parse() {
    const [result, error] = new ContextFreeGrammarParser(this.program).parse();
    if (error) {
      this.errors.push(error);
    } else {
      this.parseTree = result;
      this.result = result;
    }

    return this;
  }

  semanticAnalysis() {
    if (!this.errors.length) {
      const errors = new ContextFreeGrammarSemanticAnalyzer(this.parseTree as ParseTree).analyze();
      this.errors.push(...errors.filter(err => err.type === 'Error'));
      this.warnings.push(...errors.filter(err => err.type === 'Warning'));
    }

    if (!this.errors.length) {
      this.grammar = new SimplifiedGrammarRepresentation(this.parseTree as ParseTree);
    }

    return this;
  }

  findFirstSets() {
    return findFirstSets(this.grammar);
  }

  findFollowSets() {
    return findFollowSets(this.grammar);
  }

  toLL1() {
    const { parseTable, ...rest } = findLL1Table(this.grammar);

    let conflicts = 0;
    parseTable.forEach((row) => {
      row.forEach((col) => {
        if (col.length > 1) {
          conflicts++;
        }
      });
    });

    const conclusions = [];
    if (conflicts === 0) {
      conclusions.push('This grammar is LL(1)');
    } else {
      conclusions.push('This grammar is not LL(1)');
      conclusions.push(`${conflicts} conflicts found`);
    }

    this.result = { parseTable, ...rest, conflicts, conclusions };

    return this;
  }

  private findBottomUpConclusions(actionTable, tableType: string): string[] {
    const conclusions = [];
    let ShiftReduceConflicts = 0;
    let ReduceReduceConflicts = 0;
    let ShiftShiftConflicts = 0;
    actionTable.forEach((row) => {
      row.forEach(cell => {
        const shiftCnt = cell.reduce((cnt, op) => Number(op.action === 'shift') + cnt, 0);
        const reduceCnt = cell.reduce((cnt, op) => Number(op.action === 'reduce' || op.action === 'accept') + cnt, 0);
        if (shiftCnt && reduceCnt) ++ShiftReduceConflicts;
        if (reduceCnt > 1) ++ReduceReduceConflicts;
        if (shiftCnt > 1) ++ShiftShiftConflicts;
      });
    });

    if (ShiftReduceConflicts + ReduceReduceConflicts + ReduceReduceConflicts === 0) {
      conclusions.push(`This grammar is ${tableType}`);
    } else {
      conclusions.push(`This grammar is not ${tableType}`);
    }

    if (ShiftShiftConflicts)
      conclusions.push(`${ShiftShiftConflicts} shift/shift conflicts found`);

    if (ReduceReduceConflicts)
      conclusions.push(`${ReduceReduceConflicts} reduce/reduce conflicts found`);

    if (ShiftReduceConflicts)
      conclusions.push(`${ShiftReduceConflicts} shift/reduce conflicts found`);

    return conclusions;
  }

  toLR0() {
    const { actionTable, ...rest } = findLR0Table(this.parseTree as ParseTree, this.grammar);
    const conclusions = this.findBottomUpConclusions(actionTable, 'LR(0)');

    this.result = { actionTable, ...rest, conclusions };
    return this;
  }

  toSLR1() {
    const { actionTable, ...rest } = findSLR1Table(this.parseTree as ParseTree, this.grammar);
    const conclusions = this.findBottomUpConclusions(actionTable, 'SLR(1)');

    this.result = { actionTable, ...rest, conclusions };
    return this;
  }

  toLR1() {
    const { actionTable, ...rest } = findLR1Table(this.parseTree as ParseTree, this.grammar);
    const conclusions = this.findBottomUpConclusions(actionTable, 'LR(1)');

    this.result = { actionTable, ...rest, conclusions };
    return this;
  }

  toLALR1() {
    const { actionTable, ...rest } = findLALR1Table(this.parseTree as ParseTree, this.grammar);
    const conclusions = this.findBottomUpConclusions(actionTable, 'LALR(1)');

    this.result = { actionTable, ...rest, conclusions };
    return this;
  }

  get terminals() {
    return this.grammar.terminals;
  }

  get nonterminals() {
    return this.grammar.nonterminals;
  }
}


export {
  RegularGrammarLexer,
  ContextFreeGrammarParser,
  ContextFreeGrammarSemanticAnalyzer,
  ContextFreeGrammar,
};