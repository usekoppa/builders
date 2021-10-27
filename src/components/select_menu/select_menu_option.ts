import { APIMessageComponentEmoji } from "discord-api-types";

import { Components } from "../../api";
import { validateDescription } from "../../description";
import { JSONifiable } from "../../JSONifiable";
import { StringValidator } from "../../string_validator";
import { validateLabel } from "../validate_label";

export class SelectMenuOption<Value extends string = string>
  implements JSONifiable<Components.SelectMenu.Option>
{
  readonly label!: string;
  readonly value!: Value;
  readonly description?: string;
  readonly emoji?: APIMessageComponentEmoji;
  readonly default?: boolean;

  setValue<NewValue extends string>(value: NewValue) {
    SelectMenuOption.validateValue(value);
    Reflect.set(this, "value", value);
    return this as unknown as SelectMenuOption<NewValue>;
  }

  setLabel(label: string) {
    validateLabel(label);
    Reflect.set(this, "label", label);
    return this;
  }

  setEmoji(emoji: APIMessageComponentEmoji) {
    Reflect.set(this, "emoji", emoji);
    return this;
  }

  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  setDefault(isDefault: boolean) {
    Reflect.set(this, "default", isDefault);
    return this;
  }

  toJSON() {
    validateLabel(this.label);
    SelectMenuOption.validateValue(this.value);

    const data: Record<string, unknown> = {
      label: this.label,
      value: this.value,
    };

    if (typeof this.description !== "undefined") {
      validateDescription(this.description);
      data.description = this.description;
    }

    if (typeof this.default !== "undefined") {
      data.default = this.default;
    }

    if (typeof this.emoji !== "undefined") {
      data.emoji = this.emoji;
    }

    return data as unknown as Components.SelectMenu.Option;
  }

  private static validateValue(value: unknown): asserts value is string {
    const validator = new StringValidator("value", value);
    validator.meetsLength(100);
    validator.hasNoSymbols();
    validator.isLowercase();
  }
}
