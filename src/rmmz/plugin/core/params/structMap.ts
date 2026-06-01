import { classifyPluginParams } from "./classify";
import { structDependencies } from "./structDependencies";
import type {
  PluginArrayParamType,
  ClassifiedPluginParamsTyped,
  PluginParamEx2,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
  PrimitiveParam,
  PluginScalarParam,
  ParamKinds,
} from "./types";
import type { StructCollection } from "./types/structCollection";

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

export const collectStructsByKinds = (
  structs: ReadonlyArray<PluginStructSchemaArray>,
  kinds: ReadonlyArray<ParamKinds>,
): StructCollection => {
  const singleKinds: Set<ParamKinds> = new Set(kinds);
  const arrayKinds = new Set(kinds.map((k): `${ParamKinds}[]` => `${k}[]`));
  const scalaMatchedStructs = structs.filter((s) =>
    isAnyAttributeKindMatched(s, singleKinds, arrayKinds),
  );
  const structMap = createStructMap(scalaMatchedStructs);
  return {
    targetArrayKinds: arrayKinds,
    targetKinds: singleKinds,
    matchedStructs: new Set(scalaMatchedStructs.map((s) => s.struct)),
    nestedStructs: new Set(
      structs.flatMap((s) => structDependencies(s.struct, structMap)),
    ),
  };
};

const isAnyAttributeKindMatched = (
  struct: PluginStructSchemaArray,
  single: ReadonlySet<string>,
  array: ReadonlySet<string>,
): boolean => {
  return struct.params.some((p) => {
    return single.has(p.attr.kind) || array.has(p.attr.kind);
  });
};
