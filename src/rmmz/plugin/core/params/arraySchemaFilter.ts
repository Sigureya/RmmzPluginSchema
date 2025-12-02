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
  PluginParamEx,
  PrimitiveTextParam,
  PrimitiveParam,
  FileArrayParam,
  FileParam,
  PluginFileParamsSchema,
  PluginVariableSchema,
  RpgVariableArrayParam,
  RpgVariableParam,
} from "./types";
import {
  hasStructAttr,
  hasTextAttr,
  isFileAttr,
  isNumberAttr,
  isVariableAttr,
} from "./typeTest";

export const filterPluginParamByText = (
  schema: PluginSchemaArray
): PluginSchemaArrayFiltered<PluginParamEx<PrimitiveTextParam>> => {
  return filterPluginSchemaByParam(schema, hasTextAttr);
};

export const filterPluginSchemaByNumberParam = (schema: PluginSchemaArray) => {
  type Type = Extract<PrimitiveParam, { default: number[] | number }>;
  return filterPluginSchemaByParam<PluginParamEx<Type>>(schema, isNumberAttr);
};

export const filterPluginSchemaByVariableParam = (
  schema: PluginSchemaArray
): PluginVariableSchema => {
  type Type = RpgVariableParam | RpgVariableArrayParam;
  return filterPluginSchemaByParam<PluginParamEx<Type>>(schema, isVariableAttr);
};

export const filterPluginSchemaByFileParam = (
  schema: PluginSchemaArray
): PluginFileParamsSchema => {
  type Type = FileParam | FileArrayParam;
  return filterPluginSchemaByParam<PluginParamEx<Type>>(schema, isFileAttr);
};

export const filterPluginSchemaByParam = <T extends PluginParam>(
  schema: PluginSchemaArray,
  predicate: (param: PluginParam) => param is T
): PluginSchemaArrayFiltered<T> => {
  const base: PluginStructSchemaArray[] = schema.structs.filter((s) => {
    return s.params.some((p) => predicate(p));
  });
  const directTypeNames: ReadonlySet<string> = new Set(
    base.map((s): string => s.struct)
  );
  const depTypesName: ReadonlySet<string> = collectDependentStructNames(
    schema.structs,
    directTypeNames
  );
  type StructType = PluginStructSchemaArrayFiltered<T | StructPluginParam>;
  const newStructs: StructType[] = rebuildStructs(
    schema.structs,
    depTypesName,
    predicate
  );
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
  type Struct = PluginStructSchemaArrayFiltered<T | StructPluginParam>;

  return structs
    .map((struct): Struct => {
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
  type Command = PluginCommandSchemaArrayFiltered<T | StructPluginParam>;
  return commands
    .map((cmd): Command => {
      return {
        ...(cmd.desc ? { desc: cmd.desc } : {}),
        ...(cmd.text ? { text: cmd.text } : {}),
        command: cmd.command,
        args: rebuildParams(cmd.args, structNames, predicate),
      };
    })
    .filter((cmd) => cmd.args.length > 0);
};
