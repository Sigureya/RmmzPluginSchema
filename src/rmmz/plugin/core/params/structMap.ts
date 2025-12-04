import { classifyPluginParams } from "./classify";
import type {
  PluginArrayParamType,
  ClassifiedPluginParamsEx2,
  PluginParamEx2,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
  PrimitiveParam,
  PluginScalarParam,
} from "./types";

export const createClassifiedStructMap = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  bundle: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[]
): Map<string, ClassifiedPluginParamsEx2<S, A>> => {
  return new Map(
    bundle.map((s): [string, ClassifiedPluginParamsEx2<S, A>] => [
      s.struct,
      classifyPluginParams<S, A>(s.params),
    ])
  );
};

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
