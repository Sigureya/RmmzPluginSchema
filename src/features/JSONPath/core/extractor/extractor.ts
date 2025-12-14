import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
} from "@RmmzPluginSchema/rmmz/plugin";
import { readArrayValue } from "./array";
import { readScalarValue } from "./scalar";
import type {
  PluginValuesExtractorBundle,
  PluginValues,
  PluginValuesPathMemo,
  PluginValueScalar,
  PluginValuesStringArray,
  PluginValuesNumberArray,
} from "./types";

export const extractAllPluginValues = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  value: Record<string, JSONValue>,
  memo: ReadonlyArray<PluginValuesExtractorBundle<S, A>>
): PluginValues[] => {
  return memo.map((m) => extractBundleGroups(value, m)).flat(3);
};

const extractBundleGroups = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  value: Record<string, JSONValue>,
  memo: PluginValuesExtractorBundle<S, A>
): [PluginValues[], PluginValues[][], PluginValues[][]] => {
  const topValues: PluginValues[] = memo.top
    ? extractFromStruct(memo, value, memo.top, "")
    : [];
  const structValues: PluginValues[][] = memo.structs.map((m) =>
    extractFromStruct(memo, value, m)
  );
  const structArrayValues: PluginValues[][] = memo.structArrays.map((m) =>
    extractFromStruct(memo, value, m)
  );
  return [topValues, structValues, structArrayValues];
};

const extractFromStruct = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  bundle: PluginValuesExtractorBundle<S, A>,
  value: Record<string, JSONValue>,
  memo: PluginValuesPathMemo<S, A>,
  structName: string = memo.bundleName
): PluginValues[] => {
  const svalues: PluginValueScalar<S>[] = memo.scalar
    ? readScalarValue(
        bundle,
        structName,
        value,
        memo.scalar.jsonPathJS,
        memo.scalar.record
      )
    : [];

  const avalues: (PluginValuesStringArray[] | PluginValuesNumberArray[])[] =
    memo.arrays.map((arrayMemo) =>
      readArrayValue(bundle, structName, value, arrayMemo)
    );
  return [svalues, avalues].flat(2);
};
