import { CompileError, CompilerClass } from '@vyaakaran/compiler';
import { ContextFreeGrammar } from '@vyaakaran/compiler/context-free-grammar';
import { RegularGrammar } from '@vyaakaran/compiler/regular-grammar';
import { StateTransitionGrammar } from '@vyaakaran/compiler/turing-machine';
import { reactive } from 'vue';
import router from '../router';

interface ConsoleStream {
  type: 'Error' | 'Warning' | 'Success' | 'Output',
  timestamp: Date;
  message: string;
};

type PlaygroundType = 'RG' | 'CFG' | 'TM';

abstract class Playground {
  name: string;
  program: string;
  errors: CompileError[];
  consoleStream: ConsoleStream[];
  compiled: CompilerClass;
  progKey: number;
  abstract type: PlaygroundType;

  constructor(name: string, program: string, compiledObj: CompilerClass) {
    this.name = name;
    this.program = program;
    this.errors = [];
    this.consoleStream = [];
    this.compiled = compiledObj;
    this.progKey = 0;

    if (this.program.length) {
      this.compile();
    }
  }

  compile() {
    const start = Date.now();
    this.compiled.parse().semanticAnalysis();
    const timeTaken = Date.now() - start;

    this.errors = this.compiled.errors;
    const errors = this.compiled.errors.map(err => ({ ...err, timestamp: new Date() }));
    const warnings = this.compiled.warnings.map(err => ({ ...err, timestamp: new Date() }));

    if (!errors.length) {
      this.consoleStream = [
        ...warnings,
        {
          type: "Success",
          message: `Compiled successfully in ${timeTaken}ms`,
          timestamp: new Date(),
        },
      ];
    } else {
      this.consoleStream = [...errors, ...warnings];
    }

    this.progKey = Math.trunc(Math.random() * 10000 + 1);
  };
};

class RegularGrammarPlayground extends Playground {
  type: PlaygroundType;
  constructor(name: string, program: string) {
    super(name, program, new RegularGrammar(program));
    this.type = 'RG';
  }

  compile() {
    this.compiled = new RegularGrammar(this.program);
    super.compile();
  }
}

class ContextFreeGrammarPlayground extends Playground {
  type: PlaygroundType;
  constructor(name: string, program: string) {
    super(name, program, new ContextFreeGrammar(program));
    this.type = 'CFG';
  }

  compile() {
    this.compiled = new ContextFreeGrammar(this.program);
    super.compile();
  }
}

class TuringMachinePlayground extends Playground {
  type: PlaygroundType;
  constructor(name: string, program: string) {
    super(name, program, new StateTransitionGrammar(program));
    this.type = 'TM';
  }
  
  compile() {
    this.compiled = new StateTransitionGrammar(this.program);
    super.compile();
  }
}

const newPlayground = (name: string, type: PlaygroundType, program: string = ''): Playground => {
  switch(type) {
    case 'RG':
      return new RegularGrammarPlayground(name, program);
    case 'CFG':
      return new ContextFreeGrammarPlayground(name, program);
    case 'TM':
      return new TuringMachinePlayground(name, program);
    default:
      throw new Error("Invalid playground type");
  };
};

const playgrounds = reactive<Playground[]>([]);

function getActivePlayground(): Playground {
  const { value: route } = router.currentRoute;
  const tabIdx = route.params.id ? Number(route.params.id) : 0;

  return playgrounds[tabIdx];
}

export {
  ConsoleStream, Playground, PlaygroundType, getActivePlayground, newPlayground, playgrounds
};

