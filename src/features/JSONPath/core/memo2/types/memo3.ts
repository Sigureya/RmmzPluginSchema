import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathMemo } from "./array";
import type { ValueCategory2 } from "./result";

export interface PluginValuesPathMemo4 {
  scalar?: SSS;
  arrays: ArrayPathMemo[];
  bundleName: string;
}

export interface SSS {
  jsonPathJS: JSONPathReader;
  record: Record<string, ScalarParam>;
}

export interface MemoBundle {
  rootName: string;
  rootCategory: ValueCategory2;

  top: PluginValuesPathMemo4;
  structs: PluginValuesPathMemo4[];
  structArrays: PluginValuesPathMemo4[];
}
