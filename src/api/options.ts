/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIApplicationCommandOptionChoice,
  ChannelType,
  Snowflake,
} from "discord-api-types";

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
    export type DataOption = Choice | Channel | Base;

    interface Base {
      type:
        | Options.Type.Boolean
        | Options.Type.User
        | Options.Type.Channel
        | Options.Type.Role
        | Options.Type.Mentionable;
      name: string;
      description: string;
      required?: boolean;
    }

    export interface SubcommandGroup extends Omit<Base, "type" | "required"> {
      type: Options.Type.SubcommandGroup;
      options?: Subcommand[];
    }

    export interface Subcommand
      extends Omit<SubcommandGroup, "type" | "options"> {
      type: Options.Type.Subcommand;
      options?: DataOption[];
    }

    export interface Choice extends Omit<Base, "type"> {
      type: Options.ChoiceType;
      choices?: APIApplicationCommandOptionChoice[];
    }

    export interface Channel extends Omit<Base, "type"> {
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
      options: Subcommand[];
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
