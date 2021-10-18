import { ChannelType } from "discord-api-types";

import { Options } from "../api/options";
import { validateDescription, validateName } from "../name_and_description";

import { Option } from "./option";

export class ChannelOption<
  Name extends string = string,
  IsRequired extends boolean = boolean
> extends Option<Options.Type.Channel, Name, IsRequired> {
  readonly channelTypes?: ChannelType[];

  constructor() {
    super(Options.Type.Channel);
  }

  setName<NewName extends string>(name: NewName) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this as unknown as ChannelOption<NewName, IsRequired>;
  }

  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as ChannelOption<Name, NewIsRequired>;
  }

  setChannelTypes(types: ChannelType[]) {
    Reflect.set(this, "channelTypes", types);
    return this;
  }

  addChannelType(type: ChannelType) {
    if (typeof this.channelTypes === "undefined") {
      Reflect.set(this, "channelTypes", []);
    }

    this.channelTypes!.push(type);
    return this;
  }

  toJSON() {
    const data = super.toJSON() as Options.Outgoing.Channel;
    if (typeof this.channelTypes !== "undefined") {
      data.channel_types = this.channelTypes;
    }

    return data;
  }
}
