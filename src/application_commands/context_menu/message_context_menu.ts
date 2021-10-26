import { Commands } from "../../api";

import { BaseContextMenu } from "./base_context_menu";

export class MessageContextMenu extends BaseContextMenu<Commands.Type.MessageContextMenu> {
  constructor() {
    super(Commands.Type.MessageContextMenu);
  }
}
