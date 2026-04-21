import { classifyPluginParams } from "./classify";
import type {
  PluginArrayParamType,
  ClassifiedPluginParamsTyped,
  PluginParamEx2,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
  PrimitiveParam,
  PluginScalarParam,
} from "./types";

export const createClassifiedStructMap = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
>(
  bundle: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[],
): Map<string, ClassifiedPluginParamsTyped<S, A>> => {
  return new Map(
    bundle.map((s): [string, ClassifiedPluginParamsTyped<S, A>] => [
      s.struct,
      classifyPluginParams<S, A>(s.params),
    ]),
  );
};

export const createStructMap = (
  structs: ReadonlyArray<PluginStructSchemaArray>,
): Map<string, PrimitiveParam[]> => {
  return new Map(
    structs.map((s): [string, PrimitiveParam[]] => [
      s.struct,
      s.params.map((p) => p.attr),
    ]),
  );
};
