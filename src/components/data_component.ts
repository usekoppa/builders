import { Components } from "../api";
import { StringValidator } from "../string_validator";

import { Component } from "./component";

/**
 * A base component for components that receive interactions should extend from.
 *
 * @typeParam Type - The type of component. Only data types are allowed.
 *                   @see {@link Components.DataType} for a list of compatible types.
 */
export abstract class DataComponent<
  Type extends Components.DataType
> extends Component<Type> {
  /**
   * Whether or not the component is disabled.
   */
  readonly disabled?: boolean;

  /**
   * The custom ID for the developer to use when receiving interactions.
   */
  readonly customID?: string;

  /**
   * Disables the component in both style and intractability.
   *
   * @param disabled - Whether or not the component is disabled.
   * @returns `this`
   */
  setDisabled(disabled: boolean) {
    Reflect.set(this, "disabled", disabled);
    return this;
  }

  /**
   * Sets the custom ID for the component.
   *
   * @param customID - The custom ID.
   * @returns `this`
   */
  setCustomID(customID: string) {
    DataComponent.validateCustomID(customID);
    Reflect.set(this, "customID", customID);
    return this;
  }

  /**
   * Produces a bare-bones JSON data representation for
   * extenders to make use of.
   *
   * @returns The minimal JSON data representation.
   */
  protected _toJSON() {
    DataComponent.validateCustomID(this.customID);
    const data: Record<string, unknown> = {
      custom_id: this.customID,
    };

    if (typeof this.disabled !== "undefined") data.disabled = this.disabled;
    return data;
  }

  static validateCustomID(customId: unknown): asserts customId is string {
    const validator = new StringValidator("customID", customId);
    validator.meetsLength(100);
    validator.hasNoSymbols();
    validator.isLowercase();
  }
}
