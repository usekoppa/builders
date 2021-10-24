import { Components } from "../../api/components";
import { StringValidator } from "../../string_validator";
import { DataComponent } from "../data_component";

import { SelectMenuOption } from "./select_menu_option";

type BuilderInput<InputOption extends SelectMenuOption = SelectMenuOption> =
  | InputOption
  | ((option: InputOption) => InputOption);

export class SelectMenu<
  Values extends string[] = []
> extends DataComponent<Components.Type.SelectMenu> {
  readonly customId!: string;
  readonly options?: SelectMenuOption[];
  readonly placeholder?: string;
  readonly minSelections?: number;
  readonly maxSelections?: number;

  #defaultIdx?: number;

  constructor() {
    super(Components.Type.SelectMenu);
  }

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

  setPlaceholder(placeholder: string) {
    validatePlaceholder(placeholder);
    Reflect.set(this, "placeholder", placeholder);
    return this;
  }

  setMinSelections(minSelections: number) {
    validateMinSelections(minSelections);
    Reflect.set(this, "minSelections", minSelections);
    return this;
  }

  setMaxSelections(maxSelections: number) {
    validateMaxSelections(maxSelections);
    Reflect.set(this, "maxSelections", maxSelections);
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
      validatePlaceholder(this.placeholder);
      data.placeholder = this.placeholder;
    }

    return data as unknown as Components.SelectMenu.SelectMenu;
  }
}

function validateMinSelections(minSelections: number) {
  if (minSelections < 0 || minSelections > 25) {
    throw new Error("The minimum number of selections should be >= 0 or <= 25");
  }
}

function validateMaxSelections(maxSelections: number) {
  if (maxSelections < 0 || maxSelections > 25) {
    throw new Error("The maximum number of selections should be >= 0 or <= 25");
  }
}

function validatePlaceholder(placeholder: string) {
  const validator = new StringValidator("placeholder", placeholder);
  validator.meetsLength(100);
}
