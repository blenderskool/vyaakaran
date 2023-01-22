import minimist from 'minimist';
import split from 'argv-split';
import { ConsoleStream, getActivePlayground, Playground, playgrounds } from '../store/code';

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
    }>,
    handler: (playground: Playground, options: Record<string, CommandParamValue>, args: Record<string, CommandParamValue>) => unknown,
  }>;
};

function pushToStream(playground: Playground, type: ConsoleStream['type'], message: string | string[]) {
  if (!Array.isArray(message)) {
    message = [ message ];
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
  constructor(config: CommandConfig) {
    this.config = config;
    JitterConsole.addHelp(config);
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
      for(const option in command.options) {
        const optionConfig = command.options[option];
        if (optionConfig.default === undefined && argv[option] === undefined) {
          throw new Error(`Required option &lt;${option}&gt; not set`);
        }

        options[option] = optionConfig.type(argv[option] ?? optionConfig.default);
      }
    }

    const args: Record<string, CommandParamValue> = {};
    if (command.args !== undefined) {
      for(const i in command.args) {
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
