import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathMemo } from "./array";

export interface PluginValuesPathMemo4 {
  scalar?: {
    jsonPathJS: JSONPathReader;
    record: Record<string, ScalarParam>;
  };
  arrays: ArrayPathMemo[];
}
