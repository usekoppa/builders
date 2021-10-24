import { Embed } from "@discordjs/builders";

import { Interactions } from "../../api/interactions";
import { JSONifiable } from "../../JSONifiable";

import { CommandRequest } from "./request";

export class CommandResponse
  implements
    JSONifiable<
      Interactions.Outgoing.Response & {
        type:
          | Interactions.Outgoing.Type.ChannelMessageWithSource
          | Interactions.Outgoing.Type.DeferredChannelMessageWithSource;
      }
    >
{
  readonly content?: string;

  // TODO: Create own embed builder.
  readonly embeds?: Embed[];
  readonly isEphemeral?: boolean;
  readonly flags?: Interactions.Outgoing.Flags;
  readonly tts?: boolean;
  readonly components?: 

  #request: CommandRequest;

  constructor(request: CommandRequest) {
    this.#request = request;
  }

  toJSON() {
    return {
      type: Interactions.Outgoing.Type.ChannelMessageWithSource,
      data: { ...this },
    };
  }
}
