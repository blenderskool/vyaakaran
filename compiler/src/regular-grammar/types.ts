import { TuringMachineParseTree } from './../turing-machine/types';

enum TokenType {
  Literal = 'LITERAL',
  Identifier = 'IDENTIFER',
  Keyword = 'KEYWORD',
  Separator = 'SEPARATOR',
  Comment = 'COMMENT',
  Operator = 'OPERATOR',
};

enum SymbolType {
  Follow = '->',
  Empty = '#',
  Or = '|',
  Literal = 'TERMINAL',
  State = 'NON_TERMINAL',
  Dot = '.',
  Comment = 'COMMENT',
  Dollar = '$',
};

interface Token {
  type: [TokenType, SymbolType];
  value: string;
  position: [number, number];
};

interface ParseTree {
  type: string;
  body: (ParseTree|Token)[];
};

interface CompileError {
  type: 'Error' | 'Warning';
  message: string;
};

abstract class CompilerClass {
  program: string;
  errors: CompileError[];
  warnings: CompileError[];
  parseTree: ParseTree | TuringMachineParseTree;

  constructor(program: string) {
    this.program = program;
    this.errors = [];
    this.warnings = [];
  }

  abstract parse(): CompilerClass;
  abstract semanticAnalysis(): CompilerClass;
};

export { TokenType, Token, SymbolType, ParseTree, CompileError, CompilerClass };