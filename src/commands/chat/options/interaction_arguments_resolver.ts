import type {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";

export type Resolver<CIOR = keyof CommandInteractionOptionResolver> = Exclude<
  CIOR extends string
    ? CIOR extends `get${infer Name}`
      ? Name
      : never
    : never,
  "" | "Subcommand" | "SubcommandGroup"
>;

interface Option {
  required: boolean;
  resolver: Resolver;
}

export class InteractionArgumentsResolver {
  #options: Record<string, Option> = {};

  addOption(name: string, required: boolean, resolver: Resolver) {
    this.#options[name] = { required, resolver };
  }

  getInteractionArguments(interaction: CommandInteraction) {
    const args = Object.freeze(
      new Proxy(this.#options, {
        get(options, name: string) {
          if (Object.getOwnPropertyNames(options).includes(name)) {
            return options[name];
          }

          const option = options[name];
          return interaction.options[`get${option.resolver}`](
            name,
            option.required
          );
        },
      }) as Record<string, unknown>
    );

    return args;
  }
}
