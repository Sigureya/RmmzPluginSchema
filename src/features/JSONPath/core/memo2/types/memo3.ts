import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathMemo } from "./array";

export interface PluginValuesPathMemo4 {
  scalar?: SSS;
  arrays: ArrayPathMemo[];
}

export interface SSS {
  jsonPathJS: JSONPathReader;
  record: Record<string, ScalarParam>;
}

export interface MemoBundle {
  name: string;

  top: PluginValuesPathMemo4;
  structs: PluginValuesPathMemo4[];
  structArrays: PluginValuesPathMemo4[];
}
