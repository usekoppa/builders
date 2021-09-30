import { APIApplicationCommandOption } from "discord-api-types";

export interface ToAPIApplicationCommandOptions {
	toJSON(): APIApplicationCommandOption;
}