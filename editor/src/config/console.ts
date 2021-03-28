import { EarleyParser } from '../../../compiler/src/validator';
import { ConsoleStream, getActivePlayground, Playground } from '../store/code';
import { ParseTree } from '../../../compiler/src/regular-grammar/types';

type Command = (_: string) => ConsoleStream;

const COMMANDS: Record<string, Command> = {
  'help': () => ({
    type: 'Output',
    message: '<br>' + [
      `> clear - Clear the console.`,
      `> compile - Compile the program.`,
      `> help - List of all supported commands.`,
      `> test - Test if the string is part of language defined.`,
      `&nbsp;&nbsp;Usage: test "a b b e" where ' ' separates different symbols.`,
    ].join('<br>'),
    timestamp: new Date(),
  }),
  'compile': () => {
    const playground = getActivePlayground() as Playground;
    playground.compile();
    return { type: 'Output', message: 'Compiling...', timestamp: new Date() };
  },
  'clear': () => {
    const playground = getActivePlayground() as Playground;
    playground.consoleStream = [];
    return { type: 'Output', message: 'Console cleared', timestamp: new Date() };
  },
  'test': (input: string) => {
    const playground = getActivePlayground() as Playground;
    const match = input.match(/test "(.*)"/)?.[1];

    if (match === undefined) return { type: 'Error', message: `String to match is not defined. Usage: test "a b b e"`, timestamp: new Date() };
    if (!playground.compiled?.parseTree) return { type: 'Error', message: `Program is not compiled yet. Run 'compile'`, timestamp: new Date() };

    const parseTreeCount = new EarleyParser(playground.compiled?.parseTree as ParseTree).isParsable(match);
    if (parseTreeCount > 1) {
      return { type: 'Warning', message: `"${match}" was matched with ambiguity`, timestamp: new Date() };
    } else if (parseTreeCount === 1) {
      return { type: 'Success', message: `"${match}" was matched`, timestamp: new Date() };
    } else {
      return { type: 'Warning', message: `"${match}" did not get accepted`, timestamp: new Date() };
    }
  },
};

export { COMMANDS };
