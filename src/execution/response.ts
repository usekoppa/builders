import { Embed } from "@discordjs/builders";

import { Interactions } from "../api/interactions";
import { Component } from "../components/component";
import type { JSONifiable } from "../JSONifiable";

import { Request } from "./request";

export class Response<Arguments extends ResponseArguments = {}>
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

  constructor(public readonly request: Request) {}

  setTTS(TTS: boolean) {}

  setFlags(flags: Interactions.Outgoing.Flags) {}

  toJSON() {
    return {
      type: Interactions.Outgoing.Type.ChannelMessageWithSource,
      data: { ...this },
    };
  }
}

type ResponseArgumentsPropertyValue<
  Name extends keyof Arguments,
  Arguments extends ResponseArguments
> = Arguments[Name] extends {
  [name: string]: infer Pieces;
}
  ? Pieces
  : never;

interface ResponseArguments {
  [name: string]: {
    [name: string]: unknown;
  };
}

type ArgumentValues<Arguments extends ResponseArguments> = {
  [Key in keyof Arguments]: ResponseArgumentsPropertyValue<Key, Arguments>;
};
