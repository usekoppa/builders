import { mix } from "ts-mixer";
import { NameAndDescription } from "./name_and_desc.mixin";
import { OptionsBuilder } from "../options/options_builder.mixin";

@mix( NameAndDescription, OptionsBuilder)
export class BaseCommand<Arguments = {}> {}

export interface BaseCommand<Arguments> extends NameAndDescription, OptionsBuilder<Arguments> {}
