import { EarleyParser } from '../../../compiler/src/validator';
import { codeStore, ConsoleStream, compile } from '../store/code';
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
      `&nbsp;&nbsp;Usage: test "a.b.b.e" where '.' separates different symbols.`,
    ].join('<br>'),
    timestamp: new Date(),
  }),
  'compile': () => {
    compile();
    return { type: 'Output', message: 'Compiling...', timestamp: new Date() };
  },
  'clear': () => {
    codeStore.consoleStream = [];
    return { type: 'Output', message: 'Console cleared', timestamp: new Date() };
  },
  'test': (input: string) => {
    const match = input.match(/test "(.*)"/)?.[1];

    if (match === undefined) return { type: 'Error', message: `String to match is not defined. Usage: test "a.b.b.e"`, timestamp: new Date() };
    if (!codeStore.compiled?.parseTree) return { type: 'Error', message: `Program is not compiled yet. Run 'compile'`, timestamp: new Date() };

    const isAccepted = new EarleyParser(codeStore.compiled?.parseTree as ParseTree).isParsable(match);
    if (isAccepted) {
      return { type: 'Success', message: `"${match}" was matched`, timestamp: new Date() };
    } else {
      return { type: 'Warning', message: `"${match}" did not get accepted`, timestamp: new Date() };
    }
  },
};

export { COMMANDS };
