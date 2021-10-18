/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIChatInputApplicationCommandInteractionData,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types";

import { Interactions } from "./interactions";
import { Options } from "./options";

export namespace Commands {
  export enum Type {
    ChatInput = 1,
    UserContextMenu = 2,
    MessageContextMenu = 3,
  }

  export namespace Outgoing {
    export type ApplicationCommand =
      | ChatInput.Outgoing.Command
      | ContextMenu.Outgoing.ContextMenu;
  }

  export namespace ChatInput {
    export namespace Incoming {
      export type Interaction = Interactions.BaseInteraction<
        Interactions.Type.ApplicationCommand,
        Command
      > &
        Required<
          Pick<
            Interactions.BaseInteraction<
              Interactions.Type.ApplicationCommand,
              Command
            >,
            "channel_id" | "data"
          >
        >;

      export type Command = Omit<
        APIChatInputApplicationCommandInteractionData,
        "options" | "type"
      > & {
        type?: Commands.Type.ChatInput;
        options?: Options.Incoming.Option[];
      };
    }

    export namespace Outgoing {
      export type Command = Omit<
        RESTPostAPIApplicationCommandsJSONBody,
        "options" | "type"
      > & {
        type?: Commands.Type.ChatInput;
        options?: Options.Outgoing.Option[];
      };
    }
  }

  export namespace ContextMenu {
    export namespace Outgoing {
      export type ContextMenu = Omit<
        RESTPostAPIContextMenuApplicationCommandsJSONBody,
        "type"
      > & {
        type: Commands.Type.MessageContextMenu | Commands.Type.UserContextMenu;
      };
    }
  }
}
