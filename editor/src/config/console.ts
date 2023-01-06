import { EarleyParser } from '../../../compiler/src/validator';
import { RandomStringGenerator } from '../../../compiler/src/generator';
import { ParseTree } from '../../../compiler/src/regular-grammar/types';
import { SimplifiedGrammarRepresentation } from '../../../compiler/src/utils';
import { TestInput } from '../../../compiler/src/turing-machine/input';
import { TuringMachineStateTransition } from '../../../compiler/src/turing-machine/types';
import { JitterConsole, pushToStream } from '../utils/JitterConsole';
import { ConsoleStream } from '../store/code';
import pkg from '../../package.json';

const vykrnConsole = new JitterConsole({
  name: 'Vyaakaran console',
  version: pkg.version,
  commands: {
    'strings': {
      description: 'Generates atmost [count] random strings that are part of the language.<br/>Use "--no-accept" to generate strings not part of the language.',
      args: [
        {
          name: 'count',
          type: Number,
          default: 10,
        }
      ],
      options: {
        'accept': {
          type: Boolean,
          default: true,
        }
      },
      handler(playground, options, args) {
        const count = args.count as number;
    
        if (isNaN(count)) {
          pushToStream(playground, 'Error', `Invalid value for 'count' passed`);
          return;
        }

        if (!playground.compiled?.parseTree) return pushToStream(playground, 'Error', `Program is not compiled yet. Run 'compile'`);
    
        const generator = new RandomStringGenerator(new SimplifiedGrammarRepresentation(playground.compiled?.parseTree as ParseTree));
        try {
          const strings = options.accept ? generator.acceptableAtMost(count) : generator.unacceptableAtMost(count);
          const fmtedStrings = [...strings].map((str) => `"${str}"`);
          pushToStream(playground, 'Success', `${fmtedStrings.length} unique ${options.accept ? 'acceptable' : 'unacceptable'} strings were generated`);
          pushToStream(playground, 'Output', fmtedStrings);
        } catch(err: any) {
          console.error(err);
          pushToStream(playground, 'Error', err.message);
        }
      }
    },
    'compile': {
      description: 'Compile the program',
      handler(playground) {
        playground.compile();
      }
    },
    'clear': {
      description: 'Clear the console',
      handler(playground) {
        playground.consoleStream = [];
      }
    },
    'test': {
      description: 'Test if the string is part of language defined',
      args: [
        {
          name: 'string',
          type: String,
        }
      ],
      handler(playground, options, args) {
        if (playground.type === 'TM') {
          if (!playground.compiled?.parseTree) {
            pushToStream(playground, 'Error', `Program is not compiled yet. Run 'compile'`);
          }
          let tstr = (args.string as string).trim()
          const str = tstr + '#'
          let genobj = new TestInput(str, playground.compiled.parseTree as Map<string, TuringMachineStateTransition[]>)
          let strcheck = genobj.consoleTestString()
          if (strcheck)
            pushToStream(playground, 'Success', 'string accepted');
          else
            pushToStream(playground, 'Warning', 'string not accepted')
        } else {
          const str = (args.string as string).trim();
          // if (str === undefined) return newStream('Error', `String to match is not defined. Usage: test "a b b e"`);
          if (!playground.compiled?.parseTree) {
            pushToStream(playground, 'Error', `Program is not compiled yet. Run 'compile'`);
          }

          const parseTreeCount = new EarleyParser(playground.compiled?.parseTree as ParseTree).isParsable(str);
          if (parseTreeCount > 1) {
            pushToStream(playground, 'Warning', `"${str}" was matched with ambiguity`);
          } else if (parseTreeCount === 1) {
            pushToStream(playground, 'Success', `"${str}" was accepted`);
          } else {
            pushToStream(playground, 'Warning', `"${str}" did not get accepted`);
          }
        }
      }
    }
  }
});

function executeCommand(input: string, stream: ConsoleStream[]) {
  try {
    vykrnConsole.parse(input);
  } catch(err: any) {
    stream.push({ type: 'Error', message: err.message, timestamp: new Date() });
  }
}

export { executeCommand };
