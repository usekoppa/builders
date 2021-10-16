/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIChatInputApplicationCommandInteractionData,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types";

import { Interactions } from "./interactions";
import { Options } from "./options";

export namespace Commands {
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
        "options"
      > & { options?: Options.Incoming.Option[] };
    }

    export namespace Outgoing {
      export type Command = Omit<
        RESTPostAPIApplicationCommandsJSONBody,
        "options"
      > & { options?: Options.Outgoing.Option[] };
    }
  }

  export namespace ContextMenu {
    export namespace Outgoing {
      export type ContextMenu =
        RESTPostAPIContextMenuApplicationCommandsJSONBody;
    }
  }
}
