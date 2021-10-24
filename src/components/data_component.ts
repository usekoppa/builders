import { Components } from "../api/components";
import { StringValidator } from "../string_validator";

import { Component } from "./component";

export abstract class DataComponent<
  Type extends Components.DataType
> extends Component<Type> {
  readonly disabled?: boolean;
  readonly customId?: string;

  setDisabled(disabled: boolean) {
    Reflect.set(this, "disabled", disabled);
    return this;
  }

  setCustomId(customId: string) {
    validateCustomId(customId);
    Reflect.set(this, "customId", customId);
    return this;
  }

  protected _toJSON() {
    validateCustomId(this.customId);
    const data: Record<string, unknown> = {
      custom_id: this.customId,
    };

    if (typeof this.disabled !== "undefined") data.disabled = this.disabled;
    return data;
  }
}

export function validateCustomId(
  customId: unknown
): asserts customId is string {
  const validator = new StringValidator("customId", customId);
  validator.meetsLength(100);
  validator.hasNoSymbols();
  validator.isLowercase();
}
