import { collectDependentStructNames } from "./arraySchemaDependent";
import type {
  PluginParam,
  PluginSchemaArray,
  PluginSchemaArrayEx2,
  PluginStructSchemaArray,
  PluginStructSchemaArrayFilterd,
  StructPluginParam,
  PluginCommandSchemaArray,
  PluginCommandSchemaArrayEx3,
  PluginParamEx,
  PrimitiveTextParam,
} from "./types";
import { hasStructAttr, hasTextAttr } from "./typeTest";

export const filterPluginParamByText = (
  schema: PluginSchemaArray
): PluginSchemaArrayEx2<PluginParamEx<PrimitiveTextParam>> => {
  return filterPluginSchemaByParam(schema, hasTextAttr);
};

export const filterPluginSchemaByParam = <T extends PluginParam>(
  schema: PluginSchemaArray,
  predicate: (param: PluginParam) => param is T
): PluginSchemaArrayEx2<T> => {
  const base: PluginStructSchemaArray[] = schema.structs.filter((s) => {
    return s.params.some((p) => predicate(p));
  });
  const directTypeNames = new Set<string>(base.map((s) => s.struct));
  const depTypesName: Set<string> = collectDependentStructNames(
    schema.structs,
    directTypeNames
  );
  const newStructs: PluginStructSchemaArrayFilterd<T | StructPluginParam>[] =
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
): PluginStructSchemaArrayFilterd<T | StructPluginParam>[] => {
  type XX = PluginStructSchemaArrayFilterd<T | StructPluginParam>;

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
): PluginCommandSchemaArrayEx3<T | StructPluginParam>[] => {
  type R = PluginCommandSchemaArrayEx3<T | StructPluginParam>;
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
