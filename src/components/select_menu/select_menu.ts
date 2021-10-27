import { Components } from "../../api";
import { StringValidator } from "../../string_validator";
import { DataComponent } from "../data_component";

import { SelectMenuOption } from "./select_menu_option";

/**
 * A select menu component.
 *
 * @typeParam Values - The values of the strings that options can return from the API.
 */
export class SelectMenu<
  Values extends string[] = []
> extends DataComponent<Components.Type.SelectMenu> {
  readonly customID!: string;

  /**
   * The options that the user can select on the menu.
   */
  readonly options?: SelectMenuOption[];

  /**
   * The placeholder string for the select
   * menu for when no option is selected on the client side.
   */
  readonly placeholder?: string;

  /**
   * The maximum amount of options the user
   * can select on this select menu.
   */
  readonly maxSelections?: number;

  /**
   * The minimum amount of options the user
   * can select on this select menu.
   */
  readonly minSelections?: number;

  #defaultIdx?: number;

  constructor() {
    super(Components.Type.SelectMenu);
  }

  /**
   * Adds an option to the select menu.
   * @see {@link SelectMenu.options} for accessing the select menu's options.
   *
   * @param input - Either an option or a callback that returns an option.
   * @returns `this` but with some extra type information.
   */
  addOption<Value extends string>(
    input: BuilderInput<SelectMenuOption<Value>>
  ) {
    const option =
      input instanceof SelectMenuOption
        ? input
        : input(new SelectMenuOption<Value>());

    if (typeof this.options === "undefined") Reflect.set(this, "options", []);
    if (option.default) {
      // If another option was set as the default, fix it so that this is no longer the case.
      if (typeof this.#defaultIdx !== "undefined") {
        this.options?.[this.#defaultIdx]?.setDefault(false);
      }

      this.#defaultIdx = this.options!.length;
    }

    this.options!.push(option);
    return this as unknown as SelectMenu<[...Values, Value]>;
  }

  /**
   * Sets the placeholder.
   * @see {@link SelectMenu.placeholder} for more information on placeholders.
   *
   * @param placeholder - The placeholder.
   * @returns `this`
   */
  setPlaceholder(placeholder: string) {
    SelectMenu.validatePlaceholder(placeholder);
    Reflect.set(this, "placeholder", placeholder);
    return this;
  }

  /**
   * Set's the maximum amount of options the user can select.
   *
   * @param maxSelections - The maximum amount of options the user can select.
   * @returns `this`
   */
  setMaxSelections(maxSelections: number) {
    SelectMenu.validateMaxSelections(maxSelections);
    Reflect.set(this, "maxSelections", maxSelections);
    return this;
  }

  /**
   * Set's the minimum amount of options the user can select.
   *
   * @param minSelections - The minimum amount of options the user can select.
   * @returns `this`
   */
  setMinSelections(minSelections: number) {
    SelectMenu.validateMinSelections(minSelections);
    Reflect.set(this, "minSelections", minSelections);
    return this;
  }

  toJSON() {
    const data = super._toJSON();
    const maxValues =
      this.maxSelections ??
      (this.minSelections ? this.options?.length ?? void 0 : void 0);

    if (typeof this.minSelections !== "undefined") {
      data.min_values = this.minSelections;
    }

    if (typeof maxValues !== "undefined") data.max_values = maxValues;
    if (typeof this.options !== "undefined") {
      data.options = this.options;
    }

    if (typeof this.placeholder !== "undefined") {
      SelectMenu.validatePlaceholder(this.placeholder);
      data.placeholder = this.placeholder;
    }

    return data as unknown as Components.SelectMenu.SelectMenu;
  }

  private static validateMinSelections(minSelections: number) {
    if (minSelections < 0 || minSelections > 25) {
      throw new Error(
        "The minimum number of selections should be >= 0 or <= 25"
      );
    }
  }

  private static validateMaxSelections(maxSelections: number) {
    if (maxSelections < 0 || maxSelections > 25) {
      throw new Error(
        "The maximum number of selections should be >= 0 or <= 25"
      );
    }
  }

  private static validatePlaceholder(placeholder: string) {
    const validator = new StringValidator("placeholder", placeholder);
    validator.meetsLength(100);
  }
}

type BuilderInput<InputOption extends SelectMenuOption = SelectMenuOption> =
  | InputOption
  | ((option: InputOption) => InputOption);
