import { Commands } from "../api/commands";

import { BaseMenu } from "./base_menu";

export class MessageMenu extends BaseMenu<Commands.Type.MessageContextMenu> {
  constructor() {
    super(Commands.Type.MessageContextMenu);
  }
}
