import { validateName } from "../name";
import { validateBoolean } from "../validate_boolean";

/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  Command as _DocCommand,
  Subcommand as _DocSubcommand,
} from "./chat_input";
/* eslint-enable @typescript-eslint/no-unused-vars */

// This class isn't any stricter since Command also constitutes subcommands.
// That means if we made ApplicationCommand JSONifiable, it would not have any intersection
// with the return type of the Subcommand Option data.

/**
 * A basic application command
 *
 * @remarks
 * It does not implement the JSONifiable interface because the {@link _DocCommand Command} class
 * has no overlap with the {@link _DocSubcommand Subcommand} type.
 */
export abstract class ApplicationCommand {
  readonly name!: string;
  readonly defaultPermission?: boolean;

  /**
   * @name setName
   * @description set's the name of the application command
   * @param name {string} The name of the application command
   * @returns {this}
   */
  setName(name: string) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }

  /**
   * Makes the command use the default permissions set by Discord.
   * it should be noted that setting this to false will mean you are
   * required to set it later via the permissions endpoint.
   * @param defaultPermission {boolean} The default permission
   */
  setDefaultPermission(defaultPermission: boolean) {
    validateDefaultPermission(defaultPermission);
    Reflect.set(this, "defaultPermission", defaultPermission);
    return this;
  }

  /**
   * 
   * @returns 
   */
  protected _toJSON() {
    validateName(this.name);
    const data: Record<string, unknown> = {
      name: this.name,
    };

    if (typeof this.defaultPermission !== "undefined") {
      validateDefaultPermission(this.defaultPermission);
      data.default_permission = this.defaultPermission;
    }

    return data;
  }
}

function validateDefaultPermission(
  defaultPermission: unknown
): asserts defaultPermission is boolean {
  validateBoolean("default permission", defaultPermission);
}

/**
 * @typedef {Object} ApplicationCommand~toJSONResult
 * @property {string} name The name of the application command.
 * @property {default_permission}
 */