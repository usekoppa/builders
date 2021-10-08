import type { CommandInteractionOptionResolver } from "discord.js";

export abstract class OptionsProcessor {
  #stack: unknown[] = [];

  protected add(
    name: string,
    isRequired: boolean,
    resolverName: keyof CommandInteractionOptionResolver
  ) {
    this.#stack.push(() => void 0);
  }
}
