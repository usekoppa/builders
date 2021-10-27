import { Name, validateName } from "../name";
import { validateValueIsBoolean } from "../validate_boolean";

/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  Command as _DocCommand,
  Subcommand as _DocSubcommand,
} from "./chat_input";
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * A basic application command
 *
 * @remarks
 * It does not implement the JSONifiable interface because the {@link _DocCommand |  Command} class
 * has no overlap with the {@link _DocSubcommand | Subcommand} type.
 */
export abstract class ApplicationCommand implements Name {
  readonly name!: string;
  readonly defaultPermission?: boolean;

  setName(name: string) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }

  /**
   * Makes the command use the default permissions set by Discord.
   *
   * @remarks
   * Setting this to false will mean you are
   * required to set it later via the permissions endpoint.
   *
   * @param defaultPermission - The default permission
   */
  setDefaultPermission(defaultPermission: boolean) {
    ApplicationCommand.validateDefaultPermission(defaultPermission);
    Reflect.set(this, "defaultPermission", defaultPermission);
    return this;
  }

  /**
   * Produces a bare-bones json object for other application command types to utilise
   *
   * @returns A data object with the name and potentially the default permission preference
   *
   * @internal
   */
  protected _toJSON() {
    validateName(this.name);
    const data: Record<string, unknown> = {
      name: this.name,
    };

    if (typeof this.defaultPermission !== "undefined") {
      ApplicationCommand.validateDefaultPermission(this.defaultPermission);
      data.default_permission = this.defaultPermission;
    }

    return data;
  }

  private static validateDefaultPermission(
    defaultPermission: unknown
  ): asserts defaultPermission is boolean {
    validateValueIsBoolean("default permission", defaultPermission);
  }
}
