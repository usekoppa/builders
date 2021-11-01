/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteractionDataResolved,
  APIMessageApplicationCommandInteractionDataResolved,
  APIUserApplicationCommandInteractionDataResolved,
  ChannelType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Snowflake,
} from "discord-api-types";

import { Interactions } from "./interactions";
// Thanks ESlint, you dumbass....
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { REST } from "./rest";

export namespace Commands {
  export enum Type {
    ChatInput = 1,
    UserContextMenu = 2,
    MessageContextMenu = 3,
  }

  export type ContextMenuType =
    | Commands.Type.UserContextMenu
    | Commands.Type.MessageContextMenu;

  export namespace Incoming {
    export interface Base<Type extends Commands.Type> {
      id: Snowflake;
      type: Type;
      name: string;
      default_permission?: boolean;
    }

    export namespace Wrappers {
      export type Interaction<Data extends Base<Commands.Type>> =
        Interactions.Incoming.Base<Interactions.Type.ApplicationCommand, Data> &
          Required<
            Pick<
              Interactions.Incoming.Base<
                Interactions.Type.ApplicationCommand,
                Data
              >,
              "channel_id" | "data"
            >
          >;

      export type REST<Data extends Base<Commands.Type>> =
        REST.Incoming.Wrapper<Data>;
    }
  }

  export namespace Outgoing {
    export type ApplicationCommand =
      | ChatInput.Outgoing.Command
      | ContextMenu.Outgoing.ContextMenu;
  }

  export namespace ChatInput {
    export namespace Incoming {
      export type Interaction = Commands.Incoming.Wrappers.Interaction<Command>;
      export type REST = Commands.Incoming.Wrappers.REST<Command>;

      export interface Command
        extends Commands.Incoming.Base<Commands.Type.ChatInput> {
        options?: Options.Incoming.Option[];
        resolved?: APIChatInputApplicationCommandInteractionDataResolved;
      }

      export namespace DM {
        export type Interaction =
          Interactions.Incoming.DM.Wrapper<ChatInput.Incoming.Interaction>;
      }

      export namespace Guild {
        export type Interaction =
          Interactions.Incoming.Guild.Wrapper<ChatInput.Incoming.Interaction>;

        export type REST = REST.Incoming.Guild.Wrapper<ChatInput.Incoming.REST>;
      }
    }

    export namespace Outgoing {
      export type Command = Omit<
        RESTPostAPIChatInputApplicationCommandsJSONBody,
        "options" | "type"
      > & {
        type?: Commands.Type.ChatInput;
        options?: Options.Outgoing.Option[];
      };
    }

    /* Options */

    export namespace Options {
      export const enum Type {
        Subcommand = 1,
        SubcommandGroup = 2,
        String = 3,
        Integer = 4,
        Boolean = 5,
        User = 6,
        Channel = 7,
        Role = 8,
        Mentionable = 9,
        Number = 10,
      }

      export type DataType =
        | Options.Type.Boolean
        | Options.Type.User
        | Options.Type.Channel
        | Options.Type.Role
        | Options.Type.Mentionable
        | Options.ChoiceType;

      export type ChoiceType =
        | Options.Type.String
        | Options.Type.Integer
        | Options.Type.Number;

      export namespace Outgoing {
        export type Option = Subcommand | SubcommandGroup | DataOption;
        export type DataOption = Choice | Channel | BaseOption;

        interface BaseOption {
          type:
            | Options.Type.Boolean
            | Options.Type.User
            | Options.Type.Channel
            | Options.Type.Role
            | Options.Type.Mentionable;
          name: string;
          description: string;
          required?: boolean;
          autocomplete?: boolean;
        }

        export interface SubcommandGroup
          extends Omit<BaseOption, "type" | "required"> {
          type: Options.Type.SubcommandGroup;
          options?: Subcommand[];
        }

        export interface Subcommand
          extends Omit<SubcommandGroup, "type" | "options"> {
          type: Options.Type.Subcommand;
          options?: DataOption[];
        }

        export interface Choice extends Omit<BaseOption, "type"> {
          type: Options.ChoiceType;
          choices?: APIApplicationCommandOptionChoice[];
        }

        export interface Channel extends Omit<BaseOption, "type"> {
          type: Options.Type.Channel;
          channel_types?: ChannelType[];
        }
      }

      export namespace Incoming {
        export type Option = Subcommand | SubcommandGroup | DataOption;

        export type DataOption =
          | ChoiceDataOption
          | Role
          | Channel
          | User
          | Mentionable
          | Options.Incoming.Boolean;

        export type ChoiceDataOption =
          | Options.Incoming.Number
          | Options.Incoming.String
          | Integer;

        export interface Subcommand {
          name: string;
          type: Options.Type.Subcommand;
          options: DataOption[];
        }

        export interface SubcommandGroup {
          name: string;
          type: Options.Type.SubcommandGroup;
          options: [Subcommand];
        }

        export type String = DataOptionBase<Options.Type.String, string>;
        export type Role = DataOptionBase<Options.Type.Role, Snowflake>;
        export type Channel = DataOptionBase<Options.Type.Channel, Snowflake>;
        export type User = DataOptionBase<Options.Type.User, Snowflake>;
        export type Integer = DataOptionBase<Options.Type.Integer, number>;
        export type Number = DataOptionBase<Options.Type.Number, number>;
        export type Boolean = DataOptionBase<Options.Type.Boolean, boolean>;
        export type Mentionable = DataOptionBase<
          Options.Type.Mentionable,
          Snowflake
        >;

        interface DataOptionBase<T extends Options.DataType, D = unknown> {
          name: string;
          type: T;
          value: D;
        }
      }
    }
  }

  export namespace ContextMenu {
    export namespace Outgoing {
      export type ContextMenu<
        Type extends Commands.ContextMenuType = Commands.ContextMenuType
      > = Omit<RESTPostAPIContextMenuApplicationCommandsJSONBody, "type"> & {
        type: Type;
      };
    }

    export namespace Incoming {
      export type Interaction =
        Commands.Incoming.Wrappers.Interaction<ContextMenu>;

      export type REST = Commands.Incoming.Wrappers.REST<ContextMenu>;

      export interface ContextMenu<
        Type extends Commands.ContextMenuType = Commands.ContextMenuType,
        Resolved extends
          | APIUserApplicationCommandInteractionDataResolved
          | APIMessageApplicationCommandInteractionDataResolved =
          | APIUserApplicationCommandInteractionDataResolved
          | APIMessageApplicationCommandInteractionDataResolved
      > extends Commands.Incoming.Base<Type> {
        target_id: Snowflake;
        resolved: Resolved;
      }

      export namespace DM {
        export type Interaction =
          Interactions.Incoming.DM.Wrapper<ContextMenu.Incoming.Interaction>;
      }

      export namespace Guild {
        export type Interaction =
          Interactions.Incoming.Guild.Wrapper<ContextMenu.Incoming.Interaction>;

        export type REST =
          REST.Incoming.Guild.Wrapper<ContextMenu.Incoming.REST>;
      }
    }

    export namespace MessageContextMenu {
      export namespace Incoming {
        export type Interaction =
          Commands.Incoming.Wrappers.Interaction<MessageContextMenu>;

        export type REST = Commands.Incoming.Wrappers.REST<MessageContextMenu>;

        export type MessageContextMenu = ContextMenu.Incoming.ContextMenu<
          Commands.Type.MessageContextMenu,
          APIMessageApplicationCommandInteractionDataResolved
        >;

        export namespace DM {
          export type Interaction =
            Interactions.Incoming.DM.Wrapper<MessageContextMenu.Incoming.Interaction>;
        }

        export namespace Guild {
          export type Interaction =
            Interactions.Incoming.Guild.Wrapper<MessageContextMenu.Incoming.Interaction>;

          export type REST =
            REST.Incoming.Guild.Wrapper<MessageContextMenu.Incoming.REST>;
        }
      }
    }
  }

  export namespace UserContextMenu {
    export namespace Outgoing {
      export type UserContextMenu =
        ContextMenu.Outgoing.ContextMenu<Commands.Type.UserContextMenu>;
    }

    export namespace Incoming {
      export type Interaction =
        Commands.Incoming.Wrappers.Interaction<UserContextMenu>;

      export type REST = Commands.Incoming.Wrappers.REST<UserContextMenu>;

      export type UserContextMenu = ContextMenu.Incoming.ContextMenu<
        Commands.Type.UserContextMenu,
        APIUserApplicationCommandInteractionDataResolved
      >;

      export namespace DM {
        export type Interaction =
          Interactions.Incoming.DM.Wrapper<UserContextMenu.Incoming.Interaction>;
      }

      export namespace Guild {
        export type Interaction =
          Interactions.Incoming.Guild.Wrapper<UserContextMenu.Incoming.Interaction>;

        export type REST =
          REST.Incoming.Guild.Wrapper<UserContextMenu.Incoming.REST>;
      }
    }
  }
}
