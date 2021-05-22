import { EarleyParser } from '../../../compiler/src/validator';
import { RandomStringGenerator } from '../../../compiler/src/generator';
import { ConsoleStream, getActivePlayground, Playground } from '../store/code';
import { ParseTree } from '../../../compiler/src/regular-grammar/types';
import { SimplifiedGrammarRepresentation } from '../../../compiler/src/utils';

type Command = (_: string) => ConsoleStream[];

function newStream(type: ConsoleStream['type'], message: string | string[]): ConsoleStream[] {
  if (!Array.isArray(message)) {
    message = [ message ];
  }

  return message.map((msg) => ({
    type,
    message: msg,
    timestamp: new Date(),
  }));
}

const COMMANDS: Record<string, Command> = {
  'help': () => newStream(
    'Output',
    [
      `> clear - Clear the console.`,
      `> compile - Compile the program.`,
      `> help - List of all supported commands.`,
      `> strings - Generates atmost [count] random strings of language.
      &nbsp;&nbsp;Usage: strings [count] where count is 10 by default.`,
      `> test - Test if the string is part of language defined.
      &nbsp;&nbsp;Usage: test "a b b e" where ' ' separates different symbols.`,
    ],
  ),
  'compile': () => {
    const playground = getActivePlayground() as Playground;
    playground.compile();
    return newStream('Output', 'Compiling...');
  },
  'clear': () => {
    const playground = getActivePlayground() as Playground;
    playground.consoleStream = [];
    return newStream('Output', 'Console cleared');
  },
  'test': (input: string) => {
    const playground = getActivePlayground() as Playground;
    const match = input.match(/test "(.*)"/)?.[1];

    if (match === undefined) return newStream('Error', `String to match is not defined. Usage: test "a b b e"`);
    if (!playground.compiled?.parseTree) return newStream('Error', `Program is not compiled yet. Run 'compile'`);

    const parseTreeCount = new EarleyParser(playground.compiled?.parseTree as ParseTree).isParsable(match);
    if (parseTreeCount > 1) {
      return newStream('Warning', `"${match}" was matched with ambiguity`);
    } else if (parseTreeCount === 1) {
      return newStream('Success', `"${match}" was matched`);
    } else {
      return newStream('Warning', `"${match}" did not get accepted`);
    }
  },
  'strings': (input: string) => {
    const match = input.match(/strings (.*)/)?.[1];
    const count = parseInt(match as string);

    if (match !== undefined && isNaN(count)) {
      return newStream('Error', `"${match}" is not a valid number`);
    }
    const playground = getActivePlayground() as Playground;

    if (!playground.compiled?.parseTree) return newStream('Error', `Program is not compiled yet. Run 'compile'`);

    const generator = new RandomStringGenerator(new SimplifiedGrammarRepresentation(playground.compiled?.parseTree));
    const strings = generator.generateAtMost(match === undefined ? undefined : count);

    return [
      ...newStream('Success', `${strings.size} unique strings were generated`),
      ...newStream('Output', [...strings]),
    ];
  },
};

export { COMMANDS };
