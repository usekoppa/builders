import { APIApplicationCommandOption, ApplicationCommandOptionType } from "discord-api-types";
import { ToAPIApplicationCommandOptions } from "./to_api_option";

export type CommandOptionType = Exclude<ApplicationCommandOptionType, ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup>;

export class Option<OptionType extends CommandOptionType, Name extends string = string, IsRequired extends boolean = true> implements ToAPIApplicationCommandOptions {
  readonly name!: Name;
  readonly description!: string;
  readonly required = true as IsRequired;
  
  constructor(public readonly type: OptionType) {}

  setName<NewName extends string>(name: NewName) {
    Reflect.set(this, "name", name);
    return this as unknown as Option<OptionType, NewName, IsRequired>;
  }

  setDescription(description: string) {
    Reflect.set(this, "description", description);
    return this as unknown as Option<OptionType, Name, IsRequired>;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as Option<OptionType, Name, NewIsRequired>;
  }

  toJSON(): APIApplicationCommandOption {
    return {
      type: this.type as unknown as ApplicationCommandOptionType,
      name: this.name,
      description: this.description,
      required: this.required,
    }
  }
}

