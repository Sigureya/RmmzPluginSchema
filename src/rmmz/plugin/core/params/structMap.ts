import { collectDependentStructNames } from "./arraySchemaDependent";
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
import { hasStructAttr } from "./typeTest";

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
  const matchedParams = collectMatchedParams(schema, fn);

  const matchedStructNames = collectMatchedStructNames(schema, matchedParams);

  const retainedStructNames = collectDependentStructNames(
    schema,
    matchedStructNames,
  );

  const structs = filterStructs(schema, matchedParams, retainedStructNames);

  return {
    structName: new Set(structs.map((s) => s.struct)),
    structs,
  };
};
const collectMatchedParams = <T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PluginParam) => param is PluginParamEx<T, string>,
): Set<PluginParam> =>
  new Set(
    schema.flatMap((struct) =>
      struct.params.filter((param) => fn(param) && !hasStructAttr(param)),
    ),
  );

const collectMatchedStructNames = (
  schema: ReadonlyArray<PluginStructSchemaArray>,
  matchedParams: ReadonlySet<PluginParam>,
): Set<string> =>
  new Set(
    schema
      .filter((struct) =>
        struct.params.some((param) => matchedParams.has(param)),
      )
      .map((struct) => struct.struct),
  );

const filterStructs = (
  schema: ReadonlyArray<PluginStructSchemaArray>,
  matchedParams: ReadonlySet<PluginParam>,
  retainedStructNames: ReadonlySet<string>,
): PluginStructSchemaArray[] =>
  schema
    .map(
      (struct): PluginStructSchemaArray => ({
        struct: struct.struct,
        params: struct.params.filter((param) =>
          hasStructAttr(param)
            ? retainedStructNames.has(param.attr.struct)
            : matchedParams.has(param),
        ),
      }),
    )
    .filter((struct) => struct.params.length > 0);
