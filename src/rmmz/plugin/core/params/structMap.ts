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
  StructPluginParam,
  PluginSchemaArray,
  PluginCommandSchemaArray,
  PluginCommandSchemaArrayFiltered,
  PluginSchemaArrayFiltered,
  AnyStringParam,
  ComboParam,
  StringArrayParam,
  StringParam,
  StructRefParam,
  StructArrayRefParam,
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

export const filterPluginSchemaStringParams = (schema: PluginSchemaArray) => {
  type SS = StringParam | StringArrayParam | ComboParam | AnyStringParam;
  return filterPluginSchemaByFn<SS | StructRefParam | StructArrayRefParam>(
    schema,
    (param): param is SS =>
      param.kind === "string" ||
      param.kind === "string[]" ||
      param.kind === "combo" ||
      param.kind === "any",
  );
};

export function filterPluginSchemaByFn(
  schema: PluginSchemaArray,
  fn: (param: PrimitiveParam, name: string) => boolean,
): PluginSchemaArray;

export function filterPluginSchemaByFn<T extends PrimitiveParam>(
  schema: PluginSchemaArray,
  fn: (param: PrimitiveParam, name: string) => param is T,
): PluginSchemaArrayFiltered<PluginParamEx<T>>;

export function filterPluginSchemaByFn<T extends PrimitiveParam>(
  schema: PluginSchemaArray,
  fn: (param: PrimitiveParam, name: string) => boolean,
): PluginSchemaArrayFiltered<PluginParamEx<T>> {
  const guard = (param: PrimitiveParam, name: string): param is T =>
    fn(param, name);
  const structCollection = filterStructParamsByFn(schema.structs, guard);
  const params = schema.params.filter(
    (param): param is PluginParamEx<T> | StructPluginParam => {
      return hasStructAttr(param)
        ? structCollection.structName.has(param.attr.struct)
        : guard(param.attr, param.name);
    },
  );
  return {
    params,
    structs: structCollection.structs,
    commands: filterCmd(structCollection.structName, schema.commands, guard),
  };
}

const filterCmd = <T extends PrimitiveParam>(
  structNames: ReadonlySet<string>,
  command: readonly PluginCommandSchemaArray[],
  fn: (param: PrimitiveParam, name: string) => param is T,
): PluginCommandSchemaArrayFiltered<PluginParamEx<T> | StructPluginParam>[] => {
  return command
    .map(
      (
        cmd,
      ): PluginCommandSchemaArrayFiltered<
        PluginParamEx<T> | StructPluginParam
      > => ({
        command: cmd.command,
        ...(cmd.desc ? { desc: cmd.desc } : {}),
        ...(cmd.text ? { text: cmd.text } : {}),
        args: cmd.args.filter(
          (arg): arg is PluginParamEx<T> | StructPluginParam => {
            return hasStructAttr(arg)
              ? structNames.has(arg.attr.struct)
              : fn(arg.attr, arg.name);
          },
        ),
      }),
    )
    .filter((cmd) => cmd.args.length > 0);
};

type StructFilterResult<T extends PrimitiveParam> = {
  structName: Set<string>;
  structs: PluginStructSchemaArrayFiltered<
    PluginParamEx<T> | StructPluginParam
  >[];
};

export function filterStructParamsByFn<T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PrimitiveParam, name: string) => param is T,
): StructFilterResult<T>;

export function filterStructParamsByFn(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PrimitiveParam, name: string) => boolean,
): StructFilterResult<PrimitiveParam>;

export function filterStructParamsByFn<T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PrimitiveParam, name: string) => boolean,
): StructFilterResult<T> {
  return collectStructsByFnCore(schema, (param): param is PluginParamEx<T> => {
    return fn(param.attr, param.name);
  });
}

const collectStructsByFnCore = <T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  fn: (param: PluginParam) => param is PluginParamEx<T, string>,
): StructFilterResult<T> => {
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
): Set<PluginParamEx<T>> =>
  new Set(
    schema.flatMap((struct) =>
      struct.params.filter(
        (param): param is PluginParamEx<T> =>
          fn(param) && !hasStructAttr(param),
      ),
    ),
  );

const collectMatchedStructNames = <T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  matchedParams: ReadonlySet<PluginParamEx<T>>,
): Set<string> =>
  new Set(
    schema
      .filter((struct) =>
        struct.params.some(
          (param): param is PluginParamEx<T> =>
            !hasStructAttr(param) &&
            matchedParams.has(param as PluginParamEx<T>),
        ),
      )
      .map((struct) => struct.struct),
  );

const filterStructs = <T extends PrimitiveParam>(
  schema: ReadonlyArray<PluginStructSchemaArray>,
  matchedParams: ReadonlySet<PluginParamEx<T>>,
  retainedStructNames: ReadonlySet<string>,
): PluginStructSchemaArrayFiltered<PluginParamEx<T> | StructPluginParam>[] => {
  type Maped = PluginStructSchemaArrayFiltered<
    PluginParamEx<T> | StructPluginParam
  >;
  return schema
    .map(
      (struct: PluginStructSchemaArray): Maped => ({
        struct: struct.struct,
        params: struct.params.filter(
          (param): param is PluginParamEx<T> | StructPluginParam =>
            hasStructAttr(param)
              ? retainedStructNames.has(param.attr.struct)
              : matchedParams.has(param as PluginParamEx<T>),
        ),
      }),
    )
    .filter((struct) => struct.params.length > 0);
};
