/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIAllowedMentions,
  APIEmbed,
  APIInteractionGuildMember,
  APIMessage,
  APIUser,
  Snowflake,
} from "discord-api-types";

import { Components } from "./components";

export namespace Interactions {
  /**
   * The type of interaction
   */
  export const enum Type {
    Ping = 1,
    ApplicationCommand = 2,
    MessageComponent = 3,
  }

  export namespace Incoming {
    export type Interaction = Interactions.Incoming.Base<
      Interactions.Type,
      unknown
    >;

    export interface Base<
      Type extends Interactions.Type,
      Data extends unknown
    > {
      /**
       * ID of the interaction
       */
      id: Snowflake;

      /**
       * ID of the application this interaction is for
       */
      application_id: Snowflake;

      /**
       * The type of interaction
       */
      type: Type;

      /**
       * The command data payload
       */
      data?: Data;

      /**
       * The guild it was sent from
       */
      guild_id?: Snowflake;

      /**
       * The channel it was sent from
       */
      channel_id?: Snowflake;

      /**
       * Guild member data for the invoking user, including permissions
       *
       * **This is only sent when an interaction is invoked in a guild**
       */
      member?: APIInteractionGuildMember;

      /**
       * User object for the invoking user, if invoked in a DM
       */
      user?: APIUser;

      /**
       * A continuation token for responding to the interaction
       */
      token: string;

      /**
       * Read-only property, always `1`
       */
      version: 1;

      /**
       * For components, the message they were attached to
       */
      message?: APIMessage;
    }

    export interface Message {
      /**
       * ID of the interaction
       */
      id: Snowflake;

      /**
       * The type of interaction
       */
      type: Interactions.Type;

      /**
       * The name of the ApplicationCommand
       */
      name: string;

      /**
       * The user who invoked the interaction
       */
      user: APIUser;
    }

    export namespace DM {
      export type Wrapper<
        Original extends Interactions.Incoming.Base<Interactions.Type, unknown>
      > = Omit<Original, "member" | "guild_id"> &
        Required<Pick<Original, "user">>;
    }

    export namespace Guild {
      export type Wrapper<
        Original extends Interactions.Incoming.Base<Interactions.Type, unknown>
      > = Omit<Original, "user"> &
        Required<Pick<Original, "member" | "guild_id">>;
    }
  }

  export namespace Outgoing {
    /**
     * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
     */
    export const enum Type {
      /**
       * Acknowledges a ping.
       */
      Pong = 1,

      /**
       * Respond to an interaction with a message.
       */
      ChannelMessageWithSource = 4,

      /**
       * Acknowledges an interaction and edit a response later, the user sees a loading state.
       */
      DeferredChannelMessageWithSource = 5,

      /**
       * For components, Acknowledge an interaction and edit the original message later; the user does not see a loading state.
       */
      DeferredMessageUpdate = 6,

      /**
       * For components, edit the message the component was attached to.
       */
      UpdateMessage = 7,
    }

    export const enum Flags {
      Ephemeral = 1 << 6,
    }

    /**
     * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object
     */
    export declare type Response =
      | Pong
      | ChannelMessageWithSource
      | DeferredChannelMessageWithSource
      | DeferredMessageUpdate
      | UpdateMessage;

    export interface Pong {
      type: Outgoing.Type.Pong;
    }

    export interface ChannelMessageWithSource {
      type: Outgoing.Type.ChannelMessageWithSource;
      data: CallbackData;
    }

    export interface DeferredChannelMessageWithSource {
      type: Outgoing.Type.DeferredChannelMessageWithSource;
      data?: Pick<CallbackData, "flags">;
    }

    export interface DeferredMessageUpdate {
      type: Outgoing.Type.DeferredMessageUpdate;
    }

    export interface UpdateMessage {
      type: Outgoing.Type.UpdateMessage;
      data?: CallbackData;
    }

    export interface CallbackData {
      tts?: boolean;
      content?: string;
      embeds?: APIEmbed[];
      allowed_mentions?: APIAllowedMentions[];
      flags?: Flags;
      components?: Components.Component[];
    }
  }
}
