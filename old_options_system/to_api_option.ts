import { APIApplicationCommandOption, ChannelType } from "discord-api-types";

export type AasdfasdfPICommandOption = APIApplicationCommandOption & {
  channel_types?: ChannelType[] | null;
};

export interface ToAPIApplicationCommandOptions {
  toJSON(): APasdfdfsICommandOption;
}
