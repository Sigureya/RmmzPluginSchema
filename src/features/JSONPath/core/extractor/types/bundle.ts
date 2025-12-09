import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  NumberArrayParam,
  NumberArrayUnion,
  PluginArrayParamType,
  PluginScalarParam,
  StringArrayParam,
  StringArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginArrayPathExtractor } from "./array";
import type { ValueCategory2 } from "./result";

export interface PluginValuesPathMemo<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> {
  scalar?: PluginScalarValueExtractor<S>;
  arrays: PluginArrayPathExtractor<NA | SA>[];
  bundleName: string;
}

export interface PluginScalarValueExtractor<S extends PluginScalarParam> {
  jsonPathJS: JSONPathReader;
  record: Record<string, S>;
}

/**
 * @deprecated use PluginValuesExtractorBundle instead
 */
export type ExtractorBundle = PluginValuesExtractorBundle<
  PluginScalarParam,
  PluginArrayParamType
>;

/**
 * @deprecated use PluginValuesExtractorBundle7 instead
 */
export interface PluginValuesExtractorBundle<
  S extends PluginScalarParam,
  A extends PluginArrayParamType = PluginArrayParamType
> {
  rootName: string;
  rootCategory: ValueCategory2;

  top:
    | PluginValuesPathMemo<
        S,
        Extract<A, NumberArrayParam>,
        Extract<A, StringArrayParam>
      >
    | undefined;
  structs: PluginValuesPathMemo<
    S,
    Extract<A, NumberArrayParam>,
    Extract<A, StringArrayParam>
  >[];
  structArrays: PluginValuesPathMemo<
    S,
    Extract<A, NumberArrayParam>,
    Extract<A, StringArrayParam>
  >[];
}

export interface PluginValuesExtractorBundle7<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> {
  rootName: string;
  rootCategory: ValueCategory2;

  top: PluginValuesPathMemo<S, NA, SA> | undefined;
  structs: PluginValuesPathMemo<S, NA, SA>[];
  structArrays: PluginValuesPathMemo<S, NA, SA>[];
}
