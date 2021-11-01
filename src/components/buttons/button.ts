import { APIMessageComponentEmoji } from "discord-api-types";

import { Components } from "../../api";
import { JSONifiable } from "../../JSONifiable";
import { DataComponent } from "../data_component";
import { validateLabel } from "../validate_label";

import { DataButton } from "./data_button";
import { LinkButton } from "./link_button";

/**
 * A button component of any type, although by default it is a data button.
 *
 * @typeParam Style - The style of the button. The button becomes
 *                    a {@link LinkButton} if this is set as {@link Components.Buttons.Style.Link}
 */
export class Button<
    Style extends Components.Buttons.Style = Components.Buttons.Style.Primary
  >
  extends DataComponent<Components.Type.Button>
  implements JSONifiable<Components.Buttons.Button & { style: Style }>
{
  /**
   * The text inside of the button that the user sees on their client.
   */
  readonly label?: string;

  /**
   * An emoji to show inside the button.
   * If a label is present on the button, the emoji is to the left of the label.
   */
  readonly emoji?: APIMessageComponentEmoji;

  /**
   * The style of the button.
   * If the style is of type {@link Components.Buttons.Style.Link},
   * this component will not receive any interactions.
   */
  readonly style = Components.Buttons.Style.Primary as Style;

  /**
   * The URL for the button if it has the {@link Components.Buttons.Style.Link} style.
   */
  readonly URL?: string;

  constructor() {
    super(Components.Type.Button);
  }

  /**
   * Sets a label for the button.
   * @see {@link Button.label} for more information on button labels.
   *
   * @param label - The label.
   * @returns `this`
   */
  setLabel(label: string) {
    validateLabel(label);
    Reflect.set(this, "label", label);
    return this;
  }

  /**
   * Set's an emoji to be displayed on the button.
   * @see {@link Button.emoji} for more information on button emojis.
   *
   * @param emoji - The emoji.
   * @returns `this`
   */
  setEmoji(emoji: APIMessageComponentEmoji) {
    Reflect.set(this, "emoji", emoji);
    return this;
  }

  /**
   * Sets the style of the button.
   *
   * @typeParam NewStyle - The style of the component.
   * @param style  - The style of the component
   * @returns `this` with additional type information.
   */
  setStyle<NewStyle extends Components.Buttons.Style>(style: NewStyle) {
    Reflect.set(this, "style", style);
    return this as unknown as NewStyle extends Components.Buttons.Style.Link
      ? LinkButton
      : NewStyle extends Components.Buttons.DataButtonStyle
      ? DataButton<NewStyle>
      : never;
  }

  setCustomID(customID: string) {
    super.setCustomID(customID);
    if (this.style === Components.Buttons.Style.Link) {
      this.setStyle(Components.Buttons.Style.Primary);
    }

    return this;
  }

  /**
   * Sets the URL for the button
   */
  setURL(URL: string) {
    Reflect.set(this, "URL", URL);
    this.setStyle(Components.Buttons.Style.Link);
    return this as unknown as LinkButton;
  }

  toJSON() {
    const data: Record<string, unknown> = {
      style: this.style,
    };

    if (
      typeof this.URL !== "undefined" &&
      this.style === Components.Buttons.Style.Link
    ) {
      data.url = this.URL;
    } else {
      DataComponent.validateCustomID(this.customID);
      data.custom_id = this.customID;
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
