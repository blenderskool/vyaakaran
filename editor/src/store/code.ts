import { reactive } from 'vue';
import { CompileError } from '../../../compiler/src/regular-grammar/types';

interface ConsoleStream {
  type: 'Error' | 'Warning' | 'Success',
  timestamp: Date;
  message: string;
};

interface Store {
  program: string;
  errors: CompileError[];
  consoleStream: ConsoleStream[];
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

export { codeStore };
