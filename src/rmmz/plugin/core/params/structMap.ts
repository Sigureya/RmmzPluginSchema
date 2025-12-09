import { classifyPluginParams } from "./classify";
import type {
  PluginArrayParamType,
  ClassifiedPluginParamsEx2,
  PluginParamEx2,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
  PrimitiveParam,
  PluginScalarParam,
  NumberArrayParam,
  StringArrayParam,
  ClassifiedPluginParamsEx7,
  PluginParamEx3,
  ClassifiedPluginParams,
  PluginParam,
  StringArrayUnion,
  NumberArrayUnion,
} from "./types";

export function createClassifiedStructMap<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  bundle: PluginStructSchemaArrayFiltered<PluginParamEx3<S, NA, SA>>[]
): Map<string, ClassifiedPluginParamsEx7<S, NA, SA>>;

export function createClassifiedStructMap(
  bundle: PluginStructSchemaArrayFiltered<PluginParam>[]
): Map<string, ClassifiedPluginParams>;

export function createClassifiedStructMap<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  bundle: PluginStructSchemaArrayFiltered<PluginParamEx3<S, NA, SA>>[]
): Map<string, ClassifiedPluginParamsEx7<S, NA, SA>> {
  return new Map(
    bundle.map((s): [string, ClassifiedPluginParamsEx7<S, NA, SA>] => [
      s.struct,
      classifyPluginParams(s.params),
    ])
  );
}

export const createStructMap = (
  structs: ReadonlyArray<PluginStructSchemaArray>
): Map<string, PrimitiveParam[]> => {
  return new Map(
    structs.map((s): [string, PrimitiveParam[]] => [
      s.struct,
      s.params.map((p) => p.attr),
    ])
  );
};
