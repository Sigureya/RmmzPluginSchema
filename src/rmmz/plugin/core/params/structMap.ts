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
  PluginParam,
  PluginParamEx,
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

export function filterStructParamsByFn(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PrimitiveParam, name: string) => boolean,
) {
  return collectStructsByFnCore(
    schema,
    (param): param is PluginParamEx<PrimitiveParam> => {
      return fn(param.attr, param.name);
    },
  );
}

const collectStructsByFnCore = <T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PluginParam) => param is PluginParamEx<T, string>,
) => {
  const matchedStructs = schema
    .map((s) => {
      return {
        struct: s.struct,
        params: s.params.filter((p) => fn(p)),
      };
    })
    .filter((s) => s.params.length > 0);
  const structMap = createStructMap(matchedStructs);
  const set = new Set(
    matchedStructs.flatMap((s) => structDependencies(s.struct, structMap)),
  );
  return {
    sttuctName: set,
    structs: matchedStructs.filter((s) => set.has(s.struct)),
  };
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
