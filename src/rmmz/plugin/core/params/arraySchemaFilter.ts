import { collectDependentStructNames } from "./arraySchemaDependent";
import type {
  PluginParam,
  PluginSchemaArray,
  PluginSchemaArrayFiltered,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
  StructPluginParam,
  PluginCommandSchemaArray,
  PluginCommandSchemaArrayFiltered,
  PrimitiveParam,
  FileArrayParam,
  FileParam,
  RpgVariableArrayParam,
  RpgVariableParam,
  ArrayParamTypes,
  ScalarParam,
  PluginParamEx2,
} from "./types";
import {
  hasStructAttr,
  hasTextAttr,
  isFileAttr,
  isNumberAttr,
  isVariableAttr,
} from "./typeTest";

export const filterPluginParamByText = (schema: PluginSchemaArray) => {
  return filterPluginSchemaByParam(schema, hasTextAttr);
};

export const filterPluginSchemaByNumberParam = (schema: PluginSchemaArray) => {
  return filterPluginSchemaByParam<
    Extract<PrimitiveParam, { default: number }>,
    Extract<PrimitiveParam, { default: number[] }>
  >(schema, isNumberAttr);
};

export const filterPluginSchemaByVariableParam = (
  schema: PluginSchemaArray
): PluginSchemaArrayFiltered<
  PluginParamEx2<RpgVariableParam, RpgVariableArrayParam>
> => {
  return filterPluginSchemaByParam<RpgVariableParam, RpgVariableArrayParam>(
    schema,
    isVariableAttr
  );
};

export const filterPluginSchemaByFileParam = (
  schema: PluginSchemaArray
): PluginSchemaArrayFiltered<PluginParamEx2<FileParam, FileArrayParam>> => {
  return filterPluginSchemaByParam<FileParam, FileArrayParam>(
    schema,
    isFileAttr
  );
};

export const filterPluginSchemaByParam = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  schema: PluginSchemaArray,
  predicate: (param: PluginParam) => param is PluginParamEx2<S, A>
): PluginSchemaArrayFiltered<PluginParamEx2<S, A>> => {
  const base: PluginStructSchemaArray[] = schema.structs.filter((s) => {
    return s.params.some((p) => predicate(p));
  });
  const directTypeNames = new Set<string>(base.map((s) => s.struct));
  const depTypesName: Set<string> = collectDependentStructNames(
    schema.structs,
    directTypeNames
  );
  const newStructs: PluginStructSchemaArrayFiltered<PluginParamEx2<S, A>>[] =
    rebuildStructs(schema.structs, depTypesName, predicate);
  return {
    structs: newStructs,
    commands: rebuildCommands(schema.commands, depTypesName, predicate),
    params: rebuildParams(schema.params, depTypesName, predicate),
  } satisfies PluginSchemaArray;
};

const rebuildParams = <T extends PluginParam>(
  params: ReadonlyArray<PluginParam>,
  structNames: ReadonlySet<string>,
  predicate: (param: PluginParam) => param is T
): (T | StructPluginParam)[] => {
  return params.filter((param): param is T | StructPluginParam => {
    return hasStructAttr(param)
      ? structNames.has(param.attr.struct)
      : predicate(param);
  });
};

const rebuildStructs = <T extends PluginParam>(
  structs: ReadonlyArray<PluginStructSchemaArray>,
  structNames: ReadonlySet<string>,
  predicate: (param: PluginParam) => param is T
): PluginStructSchemaArrayFiltered<T | StructPluginParam>[] => {
  type XX = PluginStructSchemaArrayFiltered<T | StructPluginParam>;

  return structs
    .map((struct): XX => {
      return {
        struct: struct.struct,
        params: rebuildParams(struct.params, structNames, predicate),
      };
    })
    .filter((s) => s.params.length > 0);
};

export const rebuildCommands = <T extends PluginParam>(
  commands: ReadonlyArray<PluginCommandSchemaArray>,
  structNames: ReadonlySet<string>,
  predicate: (param: PluginParam) => param is T
): PluginCommandSchemaArrayFiltered<T | StructPluginParam>[] => {
  type R = PluginCommandSchemaArrayFiltered<T | StructPluginParam>;
  return commands
    .map((cmd): R => {
      return {
        ...(cmd.desc ? { desc: cmd.desc } : {}),
        ...(cmd.text ? { text: cmd.text } : {}),
        command: cmd.command,
        args: rebuildParams(cmd.args, structNames, predicate),
      };
    })
    .filter((cmd) => cmd.args.length > 0);
};
