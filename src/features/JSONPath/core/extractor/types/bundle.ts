import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathExtractor } from "./array";
import type { ValueCategory2 } from "./result";

export interface PluginValuesPathMemo4 {
  scalar?: ScalarValueExtractor;
  arrays: ArrayPathExtractor[];
  bundleName: string;
}

export interface ScalarValueExtractor {
  jsonPathJS: JSONPathReader;
  record: Record<string, ScalarParam>;
}

export interface ExtractorBundle {
  rootName: string;
  rootCategory: ValueCategory2;

  top: PluginValuesPathMemo4 | undefined;
  structs: PluginValuesPathMemo4[];
  structArrays: PluginValuesPathMemo4[];
}
