import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathMemo } from "./array";

export interface PluginValuesPathMemo3 {
  schema2: Record<string, ScalarParam>;
  jsonPathJS: JSONPathReader;
  arrays: ArrayPathMemo[];
}
