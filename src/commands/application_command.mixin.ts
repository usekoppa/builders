import { ApplicationCommandType, Snowflake } from "discord-api-types";
import { mix } from "ts-mixer";

import { Commands } from "../api_types/commands";
import { Executable } from "../executable.mixin";
import { Name } from "../name.mixin";

@mix(Name, Executable)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class ApplicationCommand<Arguments extends {}> {
  constructor(public readonly type: ApplicationCommandType) {}

  #localGuilds = new Set<Snowflake>();
  #cachedGuilds = new Set<Snowflake>();

  setName(name: string) {
    return this._setName(name);
  }

  get guilds() {
    return this.#cachedGuilds;
  }

  setGuilds(guilds: Snowflake[]) {
    this.#localGuilds = new Set(guilds);
    this.#cachedGuilds = new Set([...this.#cachedGuilds, ...this.#localGuilds]);
    return this;
  }

  addGuild(guildId: Snowflake) {
    this.#localGuilds.add(guildId);
    this.#cachedGuilds.add(guildId);
    return this;
  }

  removeGuild(guildId: Snowflake) {
    this.#localGuilds.delete(guildId);
    this.#cachedGuilds.delete(guildId);
    return this;
  }

  abstract toJSON(): Commands.Outgoing.ApplicationCommand;
}

export interface ApplicationCommand<Arguments = {}>
  extends Name,
    Executable<Arguments> {}
