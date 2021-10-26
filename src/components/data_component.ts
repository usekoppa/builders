import { Components } from "../api/components";
import { StringValidator } from "../string_validator";

import { Component } from "./component";

export abstract class DataComponent<
  Type extends Components.DataType
> extends Component<Type> {
  readonly disabled?: boolean;
  readonly customID?: string;

  setDisabled(disabled: boolean) {
    Reflect.set(this, "disabled", disabled);
    return this;
  }

  setCustomID(customId: string) {
    validateCustomID(customId);
    Reflect.set(this, "customID", customId);
    return this;
  }

  protected _toJSON() {
    validateCustomID(this.customID);
    const data: Record<string, unknown> = {
      custom_id: this.customID,
    };

    if (typeof this.disabled !== "undefined") data.disabled = this.disabled;
    return data;
  }
}

export function validateCustomID(
  customId: unknown
): asserts customId is string {
  const validator = new StringValidator("customID", customId);
  validator.meetsLength(100);
  validator.hasNoSymbols();
  validator.isLowercase();
}
