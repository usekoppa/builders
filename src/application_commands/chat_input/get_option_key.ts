/**
 * Creates an option key to access commands and options from a map.
 *
 * @param option An option with basic information.
 * @param isCommand - Whether or not the option provided is a command.S
 * @returns A symbol containing the name and type of option.
 */
export function getOptionKey(option: BasicOption, isCommand = false) {
  return Symbol.for(
    `name=${option.name},type=${isCommand ? "command" : option.type}`
  );
}

/**
 * A basic option that qualifies as either a command or option.
 */
export interface BasicOption {
  /** The name of the option */
  name: string;
  type: number;
}

/**
 * Information containing the name and type of option
 * @typedef {symbol} getOptionKey~OptionKey
 */
