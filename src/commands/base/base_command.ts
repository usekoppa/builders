import { mix } from "ts-mixer";

import { OptionsBuilder } from "../options/options_builder.mixin";

import { NameAndDescription } from "./name_and_desc.mixin";

@mix(NameAndDescription, OptionsBuilder)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseCommand<Arguments = {}> {}

export interface BaseCommand<Arguments>
  extends NameAndDescription,
    OptionsBuilder<Arguments> {}
