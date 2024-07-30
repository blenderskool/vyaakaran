import type { ParseTree } from '@vyaakaran/compiler';
import { EarleyParser, RandomStringGenerator } from '@vyaakaran/compiler/tools';
import {
  TestInput,
  TuringMachineStateTransition,
} from '@vyaakaran/compiler/turing-machine';
import { SimplifiedGrammarRepresentation } from '@vyaakaran/compiler/utils';
import pkg from '../../package.json';
import { ConsoleStream } from '../store/code';
import { JitterConsole, pushToStream } from '../utils/JitterConsole';
import { providerType } from '../ai/providerConfig';

const vykrnConsole = new JitterConsole(
  {
    name: 'Vyaakaran console',
    version: pkg.version,
    commands: {
      strings: {
        description:
          'Generates atmost [count] random strings that are part of the language.<br/>Use "--no-accept" to generate strings not part of the language.',
        args: [
          {
            name: 'count',
            type: Number,
            default: 10,
          },
        ],
        options: {
          accept: {
            type: Boolean,
            default: true,
          },
        },
        handler(playground, options, args) {
          const count = args.count as number;

          if (playground.type === 'TM') {
            pushToStream(
              playground,
              'Error',
              `'strings' command is not supported for Turing Machine playground`
            );
            return;
          }

          if (isNaN(count)) {
            pushToStream(
              playground,
              'Error',
              `Invalid value for 'count' passed`
            );
            return;
          }

          if (!playground.compiled?.parseTree)
            return pushToStream(
              playground,
              'Error',
              `Program is not compiled yet. Run 'compile'`
            );

          const generator = new RandomStringGenerator(
            new SimplifiedGrammarRepresentation(
              playground.compiled?.parseTree as ParseTree
            )
          );
          try {
            const strings = options.accept
              ? generator.acceptableAtMost(count)
              : generator.unacceptableAtMost(count);
            const fmtedStrings = [...strings].map((str) => `"${str}"`);
            pushToStream(
              playground,
              'Success',
              `${fmtedStrings.length} unique ${
                options.accept ? 'acceptable' : 'unacceptable'
              } strings were generated`
            );
            pushToStream(playground, 'Output', fmtedStrings);
          } catch (err: any) {
            console.error(err);
            pushToStream(playground, 'Error', err.message);
          }
        },
      },
      compile: {
        description: 'Compile the program',
        handler(playground) {
          playground.compile();
        },
      },
      clear: {
        description: 'Clear the console',
        handler(playground) {
          playground.consoleStream = [];
        },
      },
      test: {
        description: 'Test if the string is part of language defined',
        args: [
          {
            name: 'string',
            type: String,
          },
        ],
        handler(playground, options, args) {
          if (!playground.compiled?.parseTree) {
            pushToStream(
              playground,
              'Error',
              `Program is not compiled yet. Run 'compile'`
            );
            return;
          }

          if (playground.type === 'TM') {
            let tstr = (args.string as string).trim();
            const str = tstr + '#';
            let genobj = new TestInput(
              str,
              playground.compiled.parseTree as Map<
                string,
                TuringMachineStateTransition[]
              >
            );
            let strcheck = genobj.consoleTestString();
            if (strcheck)
              pushToStream(playground, 'Success', 'string was accepted');
            else pushToStream(playground, 'Warning', 'string was rejected');
          } else {
            const str = (args.string as string).trim();
            // if (str === undefined) return newStream('Error', `String to match is not defined. Usage: test "a b b e"`);

            const parseTreeCount = new EarleyParser(
              playground.compiled?.parseTree as ParseTree
            ).isParsable(str);
            if (parseTreeCount > 1) {
              pushToStream(
                playground,
                'Warning',
                `"${str}" was accepted with ambiguity`
              );
            } else if (parseTreeCount === 1) {
              pushToStream(playground, 'Success', `"${str}" was accepted`);
            } else {
              pushToStream(playground, 'Warning', `"${str}" was rejected`);
            }
          }
        },
      },
    },
  },
  providerType
);

function executeCommand(input: string, stream: ConsoleStream[]) {
  try {
    vykrnConsole.parse(input);
  } catch (err: any) {
    stream.push({ type: 'Error', message: err.message, timestamp: new Date() });
  }
}

export { executeCommand };
