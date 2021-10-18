/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIInteractionGuildMember,
  APIMessage,
  APIUser,
  Snowflake,
} from "discord-api-types";

export namespace Interactions {
  export const enum Type {
    Ping = 1,
    ApplicationCommand = 2,
    MessageComponent = 3,
  }

  export interface BaseInteraction<
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
}
