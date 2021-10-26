import { Components } from "../../api";

import { Button } from "./button";

export type DataButton<
  Style extends Components.Buttons.DataButtonStyle = Components.Buttons.Style.Primary
> = Omit<Button<Style>, "setURL" | "URL">;
