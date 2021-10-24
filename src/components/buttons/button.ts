import { APIMessageComponentEmoji } from "discord-api-types";

import { Components } from "../../api/components";
import { JSONifiable } from "../../JSONifiable";
import { DataComponent, validateCustomId } from "../data_component";
import { validateLabel } from "../validate_label";

import { LinkButton } from "./link_button";

export type NormalButton<
  Style extends Components.Buttons.NormalButtonStyle = Components.Buttons.Style.Primary
> = Omit<Button<Style>, "setUrl" | "url">;

export class Button<
    Style extends Components.Buttons.Style = Components.Buttons.Style.Primary
  >
  extends DataComponent<Components.Type.Button>
  implements JSONifiable<Components.Buttons.Button & { style: Style }>
{
  readonly label?: string;
  readonly emoji?: APIMessageComponentEmoji;
  readonly style = Components.Buttons.Style.Primary as Style;
  readonly url?: string;

  constructor() {
    super(Components.Type.Button);
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

  setStyle<NewStyle extends Components.Buttons.Style>(style: NewStyle) {
    Reflect.set(this, "style", style);
    return this as unknown as NewStyle extends Components.Buttons.Style.Link
      ? LinkButton
      : NewStyle extends Components.Buttons.NormalButtonStyle
      ? NormalButton<NewStyle>
      : never;
  }

  setCustomId(customId: string) {
    super.setCustomId(customId);
    if (this.style === Components.Buttons.Style.Link) {
      this.setStyle(Components.Buttons.Style.Primary);
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
