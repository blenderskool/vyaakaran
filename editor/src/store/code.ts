import { reactive } from 'vue';
import { CompileError } from '../../../compiler/src/regular-grammar/types';
import { RegularGrammar } from '../../../compiler/src/regular-grammar';

interface ConsoleStream {
  type: 'Error' | 'Warning' | 'Success' | 'Output',
  timestamp: Date;
  message: string;
};

interface Store {
  program: string;
  errors: CompileError[];
  consoleStream: ConsoleStream[];
  compiled?: RegularGrammar;
};

const codeStore = reactive({
  program: `// Type your regular grammar here

// Syntax cheat-sheet:
//    * Start symbol                 S
//    * Non-terminals:               start with uppercase character
//    * Terminals:                   start with lowercase character
//    * Follow (->):                 ->
//    * ε or λ:                      ε or λ or #
//    * Or (|):                      |
//    * Multiple symbols separator:  .

// S -> NonTerminal.follow.Symbol.Expression.Statement | #
// Expression -> or.Symbol.Expression | #
// Term -> NonTerminal | Terminal.NextTerm
// NextTerm -> dot.Term | #
// Symbol -> Term | empty

// S -> 0.A | 1.D
// A -> 0.B | 1.C
// B -> 0.B | 1.B | 0.0
// C -> 0.C | 1.C | 1.0
// D -> 0.E | 1.F
// E -> 0.E | 1.E | 0.1
// F -> 0.F | 1.F | 1.1

S -> ε | a.B | a.C | b.A | b.C | c.A | c.B
A -> b.A | c.A | ε
C -> a.C | b.C | ε
B -> a.B | c.B | ε
`,
  errors: [],
  consoleStream: [],
} as Store);

function compile() {
  const program = codeStore.program;

  const start = Date.now();
  codeStore.compiled = new RegularGrammar(program).parse().semanticAnalysis();
  const timeTaken = Date.now() - start;

  codeStore.errors = codeStore.compiled.errors;
  const errors = codeStore.compiled.errors.map(err => ({ ...err, timestamp: new Date() }));
  const warnings = codeStore.compiled.warnings.map(err => ({ ...err, timestamp: new Date() }));

  if (!errors.length) {
    codeStore.consoleStream = [ ...warnings, { type: 'Success', message: `Compiled successfully in ${timeTaken}ms`, timestamp: new Date() } ];
  } else {
    codeStore.consoleStream = [ ...errors, ...warnings ];
  }
}

export { codeStore, ConsoleStream, compile };
