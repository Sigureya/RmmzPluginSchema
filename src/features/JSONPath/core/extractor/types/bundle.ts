import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginArrayParamType,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginArrayPathExtractor } from "./array";
import type { ValueCategory2 } from "./result";

export interface PluginValuesPathMemo<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> {
  scalar?: PluginScalarValueExtractor<S>;
  arrays: PluginArrayPathExtractor<A>[];
  bundleName: string;
}

export interface PluginScalarValueExtractor<S extends PluginScalarParam> {
  jsonPathJS: JSONPathReader;
  record: Record<string, S>;
}

export interface PluginValuesExtractorBundle<
  S extends PluginScalarParam = PluginScalarParam,
  A extends PluginArrayParamType = PluginArrayParamType
> {
  rootName: string;
  rootCategory: ValueCategory2;

  top: PluginValuesPathMemo<S, A> | undefined;
  structs: PluginValuesPathMemo<S, A>[];
  structArrays: PluginValuesPathMemo<S, A>[];
}
