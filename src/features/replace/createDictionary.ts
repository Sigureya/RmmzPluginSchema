import type {
  AnyStringParam,
  PluginSchema,
  PluginSchemaArray,
  PluginStructSchemaArray,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { filterPluginSchemaByFn } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginReplacePath } from "./types";

export const createTextParamDictionary = (
  { schema, pluginName }: Pick<PluginSchema, "schema" | "pluginName">,
  anyFn: (anyParam: AnyStringParam, name: string) => boolean,
): PluginReplacePath => {
  const newSchema: PluginSchemaArray = filterPluginSchemaByFn(
    schema,
    (param, name) => {
      if (param.kind === "any") {
        return anyFn(param, name);
      }
      return param.kind === "string" || param.kind === "string[]";
    },
  );
  return createDictionary(pluginName, newSchema);
};

export const createDictionary = (
  pluginName: string,
  schema: PluginSchemaArray,
): PluginReplacePath => {
  const structMap = new Map(schema.structs.map((s) => [s.struct, s]));
  return {
    pluginName,

    paramsPath: schema.params.flatMap((param) =>
      collectPaths(structMap, [param.name], param.attr, []),
    ),

    commands: schema.commands.map((command) => ({
      commandName: command.command,

      argsPath: command.args.flatMap((arg) =>
        collectPaths(structMap, [arg.name], arg.attr, []),
      ),
    })),
  };
};

const ARRAY_ELEMENT = "[]";

const collectPaths = (
  structMap: ReadonlyMap<string, PluginStructSchemaArray>,
  path: string[],
  attr: PrimitiveParam,
  ancestry: string[],
): string[][] => {
  if (attr.kind === "struct") {
    return collectStructPaths(structMap, path, attr.struct, ancestry);
  }

  if (attr.kind === "struct[]") {
    return collectStructPaths(
      structMap,
      [...path, ARRAY_ELEMENT],
      attr.struct,
      ancestry,
    );
  }

  if (attr.kind.endsWith("[]")) {
    return [[...path, ARRAY_ELEMENT]];
  }

  return [path];
};

const collectStructPaths = (
  structMap: ReadonlyMap<string, PluginStructSchemaArray>,
  path: string[],
  structName: string,
  ancestry: string[],
): string[][] => {
  if (ancestry.includes(structName)) {
    return [path];
  }

  const structDef = structMap.get(structName);

  if (structDef === undefined) {
    return [path];
  }

  const nextAncestry = [...ancestry, structName];

  return structDef.params.flatMap((param) =>
    collectPaths(structMap, [...path, param.name], param.attr, nextAncestry),
  );
};
