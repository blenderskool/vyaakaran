import minimist from 'minimist';
import split from 'argv-split';
import { ConsoleStream, getActivePlayground, Playground, playgrounds, PlaygroundType } from '../store/code';
import { newPlayground } from '../store/code';
import { nextTick, watchEffect } from 'vue';
import router from '../router';
import { IProvider } from '../ai/ProviderInit/IProvider';
import { ProviderFactory, ProviderType } from '../ai/ProviderInit/ProviderFactory';

//Playground code from vue 
const addNewPlayground = async (type: PlaygroundType, input: string = "") => {
  playgrounds.push(newPlayground(`Program ${playgrounds.length + 1}`, type, input));
  await nextTick();
  router.replace({ params: { id: playgrounds.length - 1 } });
};

//Regex from reponse
function extractGrammar(input: string): string | undefined {
  const grammarRegex = /<grammar>([\s\S]*?)<\/grammar>/;
  const match = input.match(grammarRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return undefined;
}

type CommandParamValue = number | string | boolean;
type CommandConfig = {
  name: string,
  version: string,
  commands: Record<string, {
    description: string,
    args?: {
      name: string,
      type: NumberConstructor | StringConstructor | BooleanConstructor,
      default?: CommandParamValue,
    }[],
    options?: Record<string, {
      type: NumberConstructor | StringConstructor | BooleanConstructor,
      default?: CommandParamValue,
      alias?: string[],
      description?: string,
    }>,
    handler: (playground: Playground, options: Record<string, CommandParamValue>, args: Record<string, CommandParamValue>) => unknown,
  }>;
};

function pushToStream(playground: Playground, type: ConsoleStream['type'], message: string | string[]) {
  if (!Array.isArray(message)) {
    message = [message];
  }

  playground.consoleStream.push(
    ...message.map((msg) => ({
      type,
      message: msg,
      timestamp: new Date(),
    }))
  );
}

/**
 * Jitter Console is an in-browser abstraction on minimist to handle
 * multiple commands, args, options and also generate useful help messages.
 */
class JitterConsole {
  private config: CommandConfig;
  private provider: IProvider;

  constructor(config: CommandConfig,providerType: ProviderType) {
    this.config = config;
    this.provider = ProviderFactory.createProvider(providerType);
    JitterConsole.addHelp(config);
    JitterConsole.addGenerate(config,this.provider);
  }

  private static helpForCommand({ commands }: CommandConfig, command: string) {
    if (commands[command] === undefined) throw new Error(`Command ${command} is not supported`);

    let helpMessage = `<tr><td>${command}`;
    commands[command].args?.forEach?.((arg) => {
      helpMessage += arg.default === undefined ? ` &lt;${arg.name}&gt;` : ` [${arg.name}=${arg.default}]`;
    });

    helpMessage += `</td><td>${commands[command].description}</td></tr>`;
    return helpMessage;
  }

  private static addHelp(config: CommandConfig) {
    config.commands['help'] = {
      description: 'Get help for commands.<br/>Pass &lt;command&gt; to get help on specific command',
      args: [
        {
          name: 'command',
          type: String,
          default: '',
        }
      ],
      handler(playground, _, args) {
        let helpMessage = '';
        if (args.command === '') {
          const commands = Object.keys(config.commands);
          helpMessage = `${config.name} v${config.version}<br/>Commands:<br/><br/><table><tbody>`;

          commands.forEach((command) => helpMessage += JitterConsole.helpForCommand(config, command));
          helpMessage += '</tbody></table>';
        } else {
          const command = args.command as string;
          helpMessage = `${command} command:<br/><br/><table><tbody>${JitterConsole.helpForCommand(config, command)}</tbody></table>`;
        }

        pushToStream(playground, 'Output', helpMessage);
      }
    };
  }

  private static addGenerate(config: CommandConfig, provider:IProvider) {
    config.commands['generate'] = {
      description: 'Generate and print a given string to the console with specified grammar type \n\n grammar_type = rg, cfg, tm \n\nUse --example <string> to add example strings for better generation ',
      args: [
        {
          name: 'grammar_type',
          type: String,
          default: '',
        },
        {
          name: 'string',
          type: String,
          default: '',
        }
      ],
      options: {
        example: {
          type: String,
          alias: ['e'],
          description: 'Provide example strings for grammar generation'
        }
      },
      async handler(playground, options, args) {
        const grammarType = args.grammar_type as string;
        const inputString = args.string as string;
        const exampleStrings = options.example ? (options.example as string).split(',') : [];

        if (!grammarType) {
          pushToStream(playground, 'Error', 'Error: Grammar type not specified. Please use "generate <grammar_type> <string>"');
          return;
        }

        if (!['rg', 'cfg', 'tm'].includes(grammarType)) {
          pushToStream(playground, 'Error', 'Error: Invalid grammar type. Supported types are rg, cfg and tm');
          return;
        }

        const spinChars = ['|', '/', '-', '\\'];
        let spinIndex = 0;
        const spinMessageId = playground.consoleStream.length;

        pushToStream(playground, 'Output', `Generating grammar ${spinChars[spinIndex]}`);
        const spinAnimation = setInterval(() => {
          spinIndex = (spinIndex + 1) % spinChars.length;
          playground.consoleStream[spinMessageId].message = `Generating grammar ${spinChars[spinIndex]}`;
        }, 250);

        try {
          let generatedString;
          if (grammarType === 'rg') {
            generatedString = await provider.generateRightRegularGrammar(inputString,exampleStrings);
          } else if (grammarType === 'cfg') {
            generatedString = await provider.generateContextFreeGrammar(inputString, exampleStrings);
          } else {
            throw new Error('This grammar type is not yet implemented.');
          }

          clearInterval(spinAnimation);
          playground.consoleStream[spinMessageId].message = 'Grammar generated!';
          const grammar = extractGrammar(generatedString);
          if (grammar) {
            addNewPlayground(grammarType.toUpperCase() as PlaygroundType, grammar);
          } else {
            throw new Error('Failed to extract grammar from generated string.');
          }
        } catch (error: unknown) {
          clearInterval(spinAnimation);
          if (error instanceof Error) {
            pushToStream(playground, 'Error', `Error generating AI response: ${error.message}`);
          } else {
            pushToStream(playground, 'Error', 'An unknown error occurred while generating AI response');
          }
        }
      }
    };
  }

  /**
   * Parse input command string and execute appropriate handler for that command
   * @param input Command String
   */
  parse(input: string) {
    if (!input) return;

    const playground = getActivePlayground() as Playground;
    pushToStream(playground, 'Output', input);

    const commandStr = split(input);
    const commandName = commandStr[0];
    if (!commandName || commandName.startsWith('-')) throw new Error("Command not formatted as expected");
    if (this.config.commands[commandName] === undefined) throw new Error(`${commandName} is not a supported command. Type 'help' to get a list of supported commands.`);

    const command = this.config.commands[commandName];

    if (commandName === 'generate') {
      const argv = minimist(commandStr.slice(1), {
        string: ['example'],
        alias: { e: 'example' }
      });
      const grammarType = argv._[0];
      const generatedString = argv._.slice(1).join(' ');
      const exampleOption: Record<string, CommandParamValue> = {};
      if (argv.example) {
        exampleOption.example = argv.example;
      }
      command.handler(playground, exampleOption, { grammar_type: grammarType, string: generatedString });
      return;
    }

    const argv = minimist(commandStr.slice(1), {
      default: Object.fromEntries(
        Object.keys(command.options ?? {})
          .filter(key => command.options?.[key]?.default !== undefined)
          .map(key => [key, command.options?.[key].default])
      ),
      string: ['_'],
      alias: Object.fromEntries(
        Object.keys(command.options ?? {})
          .map(key => [key, command.options?.[key]?.alias ?? []])
      ),
      boolean: Object.keys(command.options ?? {})
        .filter(key => command.options?.[key]?.type === Boolean)
        .map(key => key),
    });

    if (argv.help) {
      // show help of a command when using --help option
      this.config.commands.help.handler(playground, {}, { command: commandName });
      return;
    }

    const options: Record<string, CommandParamValue> = {};
    if (command.options !== undefined) {
      for (const option in command.options) {
        const optionConfig = command.options[option];
        if (optionConfig.default === undefined && argv[option] === undefined) {
          throw new Error(`Required option &lt;${option}&gt; not set`);
        }

        options[option] = optionConfig.type(argv[option] ?? optionConfig.default);
      }
    }

    const args: Record<string, CommandParamValue> = {};
    if (command.args !== undefined) {
      for (const i in command.args) {
        const arg = command.args[i];
        if (arg.default === undefined && argv._[i] === undefined) {
          throw new Error(`Required argument &lt;${arg.name}&gt; not passed`);
        }

        args[arg.name] = arg.type(argv._[i] ?? arg.default);
      }
    }

    // Execute the command
    command.handler(playground, options, args);
  }
}

export { JitterConsole, pushToStream };



