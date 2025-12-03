import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ArrayParamTypes,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathExtractor } from "./array";
import type { ValueCategory2 } from "./result";

export interface PluginValuesPathMemo4<
  S extends ScalarParam = ScalarParam,
  A extends ArrayParamTypes = ArrayParamTypes
> {
  scalar?: ScalarValueExtractor<S>;
  arrays: ArrayPathExtractor<A>[];
  bundleName: string;
}

export interface ScalarValueExtractor<S extends ScalarParam> {
  jsonPathJS: JSONPathReader;
  record: Record<string, S>;
}

export interface ExtractorBundle<
  S extends ScalarParam = ScalarParam,
  A extends ArrayParamTypes = ArrayParamTypes
> {
  rootName: string;
  rootCategory: ValueCategory2;

  top: PluginValuesPathMemo4<S, A> | undefined;
  structs: PluginValuesPathMemo4<S, A>[];
  structArrays: PluginValuesPathMemo4<S, A>[];
}
