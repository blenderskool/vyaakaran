import { reactive } from 'vue';
import { CompileError, CompilerClass } from '../../../compiler/src/regular-grammar/types';
import { RegularGrammar } from '../../../compiler/src/regular-grammar';
import { ContextFreeGrammar } from '../../../compiler/src/context-free-grammar';
import router from '../router';

interface ConsoleStream {
  type: 'Error' | 'Warning' | 'Success' | 'Output',
  timestamp: Date;
  message: string;
};

interface Playground {
  name: string;
  program: string;
  errors: CompileError[];
  consoleStream: ConsoleStream[];
  compiled?: CompilerClass;
  progKey: number;
};

const program =`// Type your regular grammar here

// Syntax cheat-sheet:
//    * Start symbol                 S
//    * Follow (->):                 ->
//    * ε or λ:                      ε or λ or #
//    * Or (|):                      |
//    * End each rule:               .
//    * Comments:                    // comment
//    * Non-terminals:               start with uppercase character
//    * Terminals:                   start with any other character

S -> ε | a B | a C | b A | b C | c A | c B.
A -> b A | c A | ε.
C -> a C | b C | ε.
B -> a B | c B | ε.
`;


const newPlayground = (name: string): Playground => ({
  name,
  consoleStream: [],
  errors: [],
  progKey: 0,
  program: '',
});

const codeStore = reactive<Record<string, Playground[]>>({
  'regular-grammar': [
    {
      ...newPlayground('New Tab'),
      program,
    },
  ],
  'context-free-grammar': [
    {
      ...newPlayground('New Tab'),
      program,
    },
  ],
});

function getActiveStore(all: boolean = false): Playground | undefined | Playground[] {
  const { value:route } = router.currentRoute;
  const tabIdx = route.params.id ? Number(route.params.id) : 0;

  if (!route.meta.storeId) return all ? [] : undefined;

  const playgrounds = codeStore[route.meta.storeId];
  return all ? playgrounds : playgrounds[tabIdx];
}

function compile() {
  const storeId = router.currentRoute.value.meta.storeId;
  const store = getActiveStore() as Playground;
  const program = store.program;

  const start = Date.now();
  switch (storeId) {
    case 'regular-grammar':
      store.compiled = new RegularGrammar(program).parse().semanticAnalysis();
      break;
    case 'context-free-grammar':
      store.compiled = new ContextFreeGrammar(program).parse().semanticAnalysis();
      break;
  }
  const timeTaken = Date.now() - start;

  store.errors = store.compiled!.errors;
  const errors = store.compiled!.errors.map(err => ({ ...err, timestamp: new Date() }));
  const warnings = store.compiled!.warnings.map(err => ({ ...err, timestamp: new Date() }));

  if (!errors.length) {
    store.consoleStream = [ ...warnings, { type: 'Success', message: `Compiled successfully in ${timeTaken}ms`, timestamp: new Date() } ];
  } else {
    store.consoleStream = [ ...errors, ...warnings ];
  }

  store.progKey = Math.trunc(Math.random() * 10000);
}

export {
  codeStore,
  ConsoleStream,
  compile,
  getActiveStore,
  Playground,
  newPlayground,
};
