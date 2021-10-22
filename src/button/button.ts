import { APIMessageComponentEmoji } from "discord-api-types";

import { Components } from "../api/components";
import { JSONifiable } from "../JSONifiable";
import { StringValidator } from "../string_validator";

import { LinkButton } from "./link_button";

export type NormalButton<
  Style extends Components.Buttons.NormalButtonStyle = Components.Buttons.Style.Primary
> = Omit<Button<Style>, "setUrl" | "url">;

export class Button<
  Style extends Components.Buttons.Style = Components.Buttons.Style.Primary
> implements JSONifiable<Components.Buttons.Button & { style: Style }>
{
  readonly label?: string;
  readonly emoji?: APIMessageComponentEmoji;
  readonly style = Components.Buttons.Style.Primary as Style;
  readonly disabled?: boolean;
  readonly customId?: string;
  readonly url?: string;

  setLabel(label: string) {
    validateLabel(label);
    Reflect.set(this, "label", label);
    return this;
  }

  setEmoji(emoji: APIMessageComponentEmoji) {
    Reflect.set(this, "emoji", emoji);
    return this;
  }

  setStyle<NewStyle extends Components.Buttons.Style>(style: NewStyle) {
    Reflect.set(this, "style", style);
    return this as unknown as NewStyle extends Components.Buttons.Style.Link
      ? LinkButton
      : NewStyle extends Components.Buttons.NormalButtonStyle
      ? NormalButton<NewStyle>
      : never;
  }

  setDisabled(disabled: boolean) {
    Reflect.set(this, "disabled", disabled);
    return this;
  }

  setCustomId(customId: string) {
    validateCustomId(customId);
    Reflect.set(this, "customId", customId);
    if (this.style === Components.Buttons.Style.Link) {
      return this.setStyle(Components.Buttons.Style.Primary);
    }

    return this;
  }

  setUrl(url: string) {
    Reflect.set(this, "url", url);
    return this as unknown as LinkButton;
  }

  toJSON() {
    const data: Record<string, unknown> = {
      style: this.style,
    };

    if (
      typeof this.url !== "undefined" &&
      this.style === Components.Buttons.Style.Link
    ) {
      data.url = this.url;
    } else {
      validateCustomId(this.customId);
      data.custom_id = this.customId;
    }

    let labelTestSucceeded = false;
    if (typeof this.label !== "undefined") {
      validateLabel(this.label);
      labelTestSucceeded = true;
      data.label = this.label;
    }

    if (typeof this.emoji !== "undefined") {
      data.emoji = this.emoji;
    } else if (!labelTestSucceeded) {
      throw new Error("Button does not have emoji or label");
    }

    if (typeof this.disabled !== "undefined") data.disabled = this.disabled;

    return data as unknown as Components.Buttons.Button & { style: Style };
  }
}

function validateCustomId(customId: unknown): asserts customId is string {
  const validator = new StringValidator("customId", customId);
  validator.meetsLength(100);
  validator.hasNoSymbols();
  validator.isLowercase();
}

function validateLabel(label: unknown): asserts label is string {
  const validator = new StringValidator("label", label);
  validator.meetsLength(80);
}
