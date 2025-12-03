import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ScalarParam,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";
import { readArrayValue } from "./array";
import { readScalarValue } from "./scalar";
import type {
  ExtractorBundle,
  PluginValues,
  PluginValuesPathMemo4,
  PluginValueScalar,
  PluginValuesStringArray,
  PluginValuesNumberArray,
} from "./types";

export const extractAllPluginValues = (
  value: JSONValue,
  memo: ReadonlyArray<ExtractorBundle>
): PluginValues[] => {
  return memo.map((m) => extractBundleGroups(value, m)).flat(3);
};

const extractBundleGroups = <S extends ScalarParam, A extends ArrayParamTypes>(
  value: JSONValue,
  memo: ExtractorBundle<S, A>
): [PluginValues[], PluginValues[][], PluginValues[][]] => {
  const topValues: PluginValues[] = memo.top
    ? extractFromStruct(memo, value, memo.top)
    : [];
  const structValues: PluginValues[][] = memo.structs.map((m) =>
    extractFromStruct(memo, value, m)
  );
  const structArrayValues: PluginValues[][] = memo.structArrays.map((m) =>
    extractFromStruct(memo, value, m)
  );
  return [topValues, structValues, structArrayValues];
};

const extractFromStruct = <S extends ScalarParam, A extends ArrayParamTypes>(
  bundle: ExtractorBundle<S, A>,
  value: JSONValue,
  memo: PluginValuesPathMemo4<S, A>
): PluginValues[] => {
  const structName = memo.bundleName;
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
