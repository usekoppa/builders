import type { ChannelType } from "discord-api-types";

import { Commands } from "../../api";

import { Option } from "./option";

export class ChannelOption<
  Name extends string = string,
  IsRequired extends boolean = boolean
> extends Option<Commands.ChatInput.Options.Type.Channel, Name, IsRequired> {
  readonly channelTypes?: Set<ChannelType>;

  constructor() {
    super(Commands.ChatInput.Options.Type.Channel);
  }

  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as ChannelOption<NewName, IsRequired>;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    super.setRequired(required);
    return this as unknown as ChannelOption<Name, NewIsRequired>;
  }

  setChannelTypes(types: ChannelType[]) {
    Reflect.set(this, "channelTypes", new Set(types));
    return this;
  }

  addChannelType(type: ChannelType) {
    if (typeof this.channelTypes === "undefined") {
      Reflect.set(this, "channelTypes", new Set());
    }

    this.channelTypes!.add(type);
    return this;
  }

  toJSON() {
    const data = super.toJSON() as Commands.ChatInput.Options.Outgoing.Channel;
    if (typeof this.channelTypes !== "undefined") {
      data.channel_types = [...this.channelTypes.values()];
    }

    return data;
  }
}
