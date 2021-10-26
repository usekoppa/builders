/* eslint-disable @typescript-eslint/no-namespace */

import {
  APIMessageComponentEmoji,
  APISelectMenuOption,
} from "discord-api-types";

export namespace Components {
  export const enum Type {
    ActionRow = 1,
    Button = 2,
    SelectMenu = 3,
  }

  export type DataType = Type.Button | Type.SelectMenu;

  export type Component = ActionRow | DataComponent;
  export type DataComponent = Buttons.Button | SelectMenu.SelectMenu;

  export interface Base<Type extends Components.Type> {
    type: Type;
  }

  export interface ActionRow
    extends Components.Base<Components.Type.ActionRow> {
    components: DataComponent[];
  }

  export namespace Buttons {
    export const enum Style {
      Primary = 1,
      Secondary = 2,
      Success = 3,
      Danger = 4,
      Link = 5,
    }

    export type DataButtonStyle =
      | Buttons.Style.Primary
      | Buttons.Style.Secondary
      | Buttons.Style.Success
      | Buttons.Style.Danger;

    export type Button = Normal | Link;

    export interface Normal<Style extends DataButtonStyle = DataButtonStyle>
      extends Buttons.Base<Style> {
      custom_id: string;
    }

    export interface Link extends Buttons.Base<Buttons.Style.Link> {
      url: string;
    }

    export interface Base<Style extends Buttons.Style>
      extends Components.Base<Components.Type.Button> {
      label?: string;
      style: Style;
      emoji?: APIMessageComponentEmoji;
      disabled?: boolean;
    }
  }

  export namespace SelectMenu {
    export type Option = APISelectMenuOption;
    export interface SelectMenu
      extends Components.Base<Components.Type.SelectMenu> {
      custom_id: string;
      options: SelectMenu.Option[];
      placeholder?: string;
      min_values?: number;
      max_values?: number;
      disabled?: boolean;
    }
  }
}
