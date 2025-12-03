import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathExtractor } from "./array";
import type { ValueCategory2 } from "./result";

export interface PluginValuesPathMemo4<S extends ScalarParam = ScalarParam> {
  scalar?: ScalarValueExtractor<S>;
  arrays: ArrayPathExtractor[];
  bundleName: string;
}

export interface ScalarValueExtractor<S extends ScalarParam = ScalarParam> {
  jsonPathJS: JSONPathReader;
  record: Record<string, S>;
}

export interface ExtractorBundle<S extends ScalarParam = ScalarParam> {
  rootName: string;
  rootCategory: ValueCategory2;

  top: PluginValuesPathMemo4<S> | undefined;
  structs: PluginValuesPathMemo4<S>[];
  structArrays: PluginValuesPathMemo4<S>[];
}
