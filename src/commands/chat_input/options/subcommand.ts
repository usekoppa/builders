import { mix } from "ts-mixer";

import { Options } from "../../../api_types/options";
import { Executable } from "../../../executable.mixin";

import { Option } from "./option.mixin";
import { OptionsBuilder } from "./options_builder.mixin";

@mix(OptionsBuilder, Executable)
export class Subcommand<
  Name extends string = string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Arguments = {}
> extends Option<Options.Type.Subcommand, Name, false> {
  constructor() {
    super(Options.Type.Subcommand);
  }

  resolve(option: Options.Incoming.Subcommand) {
    if (typeof this.executor === "undefined") return;
    return this.getArguments(option.options);
  }

  toJSON() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      options: this.options.map(option => option.toJSON()),
    } as Options.Outgoing.Subcommand;
  }
}

export interface Subcommand<Name extends string = string, Arguments = {}>
  extends Option<Options.Type.Subcommand, Name, false>,
    OptionsBuilder<Subcommand<Name>, Arguments>,
    Executable<Arguments> {}
