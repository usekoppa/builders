import { Components } from "../api/components";

import { Button } from "./button";

export type LinkButton = Omit<
  Button<Components.Buttons.Style.Link>,
  "setCustomId" | "customId"
>;
