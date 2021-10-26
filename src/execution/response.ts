import { Embed } from "@discordjs/builders";

import { Interactions } from "../api/interactions";
import { Component } from "../components/component";
import type { JSONifiable } from "../JSONifiable";

import { CommandRequest } from "./request";

export class InteractionResponse
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
  readonly TTS?: boolean;
  readonly components?: Component[];

  constructor(public readonly request: CommandRequest) {}

  setTTS(TTS: boolean) {

  }

  toJSON() {
    return {
      type: Interactions.Outgoing.Type.ChannelMessageWithSource,
      data: { ...this },
    };
  }
}
