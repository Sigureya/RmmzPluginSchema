import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginParamEx2,
  NumberArrayParam,
  StringArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { readArrayValue } from "./array";
import { readScalarValue } from "./scalar";
import type {
  PluginValues,
  PluginValuesPathMemo,
  PluginValueScalar,
  PluginValuesArrayExN,
  PluginValues2,
  PluginValuesArrayExS,
  PluginValuesExtractorBundle7,
} from "./types";

export const extractAllPluginValues = <
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  value: JSONValue,
  memo: ReadonlyArray<PluginValuesExtractorBundle7<S, NA, SA>>
): PluginValues<PluginParamEx2<S, NA | SA>>[] => {
  return memo.map((m) => extractBundleGroups<S, NA, SA>(value, m)).flat(3);
};

const extractBundleGroups = <
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  value: JSONValue,
  memo: PluginValuesExtractorBundle7<S, NA, SA>
): [
  PluginValues<PluginParamEx2<S, NA | SA>>[],
  PluginValues<PluginParamEx2<S, NA | SA>>[][],
  PluginValues<PluginParamEx2<S, NA | SA>>[][]
] => {
  type PVX = PluginValues<PluginParamEx2<S, NA | SA>>;
  const topValues: PVX[] = memo.top
    ? extractFromStruct<S, NA, SA>(memo, value, memo.top)
    : [];
  const structValues: PVX[][] = memo.structs.map((m) =>
    extractFromStruct<S, NA, SA>(memo, value, m)
  );
  const structArrayValues: PVX[][] = memo.structArrays.map((m): PVX[] =>
    extractFromStruct<S, NA, SA>(memo, value, m)
  );
  return [topValues, structValues, structArrayValues];
};

const extractFromStruct = <
  SC extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  bundle: PluginValuesExtractorBundle7<SC, NA, SA>,
  value: JSONValue,
  memo: PluginValuesPathMemo<SC, NA, SA>
): PluginValues2<SC, NA | SA>[] => {
  const structName = memo.bundleName;
  const svalues: PluginValueScalar<SC>[] = memo.scalar
    ? readScalarValue(
        bundle,
        structName,
        value,
        memo.scalar.jsonPathJS,
        memo.scalar.record
      )
    : [];

  const avalues: (PluginValuesArrayExS<SA>[] | PluginValuesArrayExN<NA>[])[] =
    memo.arrays.map(
      (arrayMemo): PluginValuesArrayExS<SA>[] | PluginValuesArrayExN<NA>[] =>
        readArrayValue<NA, SA>(bundle, structName, value, arrayMemo)
    );
  return [svalues, avalues].flat(2);
};
