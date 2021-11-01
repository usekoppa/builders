/* eslint-disable @typescript-eslint/no-namespace */

import { Snowflake } from "discord-api-types";

export namespace REST {
  export namespace Incoming {
    export interface RESTProperties {
      id: Snowflake;
      application_id: Snowflake;
      guild_id?: Snowflake;
      version: Snowflake;
    }

    export type Wrapper<Original extends unknown> = Omit<
      Original,
      keyof RESTProperties
    > &
      RESTProperties;

    export namespace Guild {
      export type Wrapper<Original extends RESTProperties> = Original &
        Required<Pick<Original, "guild_id">>;
    }
  }
}
