import { APIApplicationCommandOption, ChannelType } from "discord-api-types";

export type APICommandOption = APIApplicationCommandOption & {
  channel_types?: ChannelType[] | null;
};

export interface ToAPIApplicationCommandOptions {
  toJSON(): APICommandOption;
}
