import { ApplicationCommandOptionType, ChannelType } from "discord-api-types";

import { Option } from "./option_types/option";

export class ChannelOption<
  Name extends string = string,
  IsRequired extends boolean = true
> extends Option<ApplicationCommandOptionType.Channel, Name, IsRequired> {
  readonly channelTypes!: ChannelType[] | undefined;

  setChannelTypes(channelTypes: ChannelType[]) {
    this.#verifyChannelTypes(channelTypes);
    return this.#setChannelTypesWithNoCheck(channelTypes);
  }

  addChannelType(channelType: ChannelType) {
    const channelTypes = this.channelTypes ?? [];
    channelTypes.push(channelType);
    this.#verifyChannelTypes(channelTypes);
    return this.#setChannelTypesWithNoCheck(channelTypes);
  }

  removeChannelType(channelType: ChannelType) {
    const idx = this.channelTypes?.findIndex(type => type === channelType);
    if (typeof idx !== "undefined") {
      this.channelTypes?.splice(idx, 1);
    }

    return this;
  }

  toJSON() {
    const data = super.toJSON();

    if (typeof this.channelTypes !== "undefined") {
      this.#verifyChannelTypes();
      data.channel_types = this.channelTypes;
    }

    return data;
  }

  #setChannelTypesWithNoCheck(channelTypes: ChannelType[]) {
    Reflect.set(this, "channelTypes", channelTypes);
    return this;
  }

  #verifyChannelTypes(
    channelTypes: ChannelType[] | undefined = this.channelTypes
  ) {
    if (channelTypes?.length === 0) {
      throw new Error("You must specify at least one channel type");
    }

    if ((channelTypes?.length ?? 14) > 14) {
      throw new Error(
        "There are only 14 channel types, please select one of each at your discretion"
      );
    }
  }
}
