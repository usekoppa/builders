import { mix } from "ts-mixer";

import { Options } from "../../../api_types/options";
import { Executable } from "../../../executable.mixin";

import { Option } from "./option.mixin";
import { OptionsBuilder } from "./options_builder.mixin";

@mix(Executable, OptionsBuilder)
export class Subcommand<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Arguments = {}
> extends Option<Options.Type.Subcommand, string, false> {
  readonly options: Option<Options.DataType>[] = [];

  constructor() {
    super(Options.Type.Subcommand);
  }

  resolve(_option: Options.Incoming.Subcommand) {
    // return this.getArguments(option.options);
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

export interface Subcommand<Arguments = {}>
  extends Option<Options.Type.Subcommand, string, false>,
    OptionsBuilder<Arguments>,
    Executable<Arguments> {}
