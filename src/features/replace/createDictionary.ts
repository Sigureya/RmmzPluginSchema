import type {
  PluginSchemaArray,
  PluginStructSchemaArray,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { TargetPath } from "./handlers";

export const createDictionary = (
  pluginName: string,
  schema: PluginSchemaArray,
): TargetPath => {
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

const collectPaths = (
  structMap: ReadonlyMap<string, PluginStructSchemaArray>,
  path: string[],
  attr: PrimitiveParam,
  ancestry: string[],
): string[][] => {
  const current = [path];

  if (attr.kind === "struct") {
    if (ancestry.includes(attr.struct)) {
      return current;
    }

    const structDef = structMap.get(attr.struct);

    return structDef === undefined
      ? current
      : [
          ...current,
          ...structDef.params.flatMap((param) =>
            collectPaths(structMap, [...path, param.name], param.attr, [
              ...ancestry,
              attr.struct,
            ]),
          ),
        ];
  }

  if (attr.kind === "struct[]") {
    if (ancestry.includes(attr.struct)) {
      return current;
    }

    const arrayPath = [...path, "[]"];
    const structDef = structMap.get(attr.struct);

    return structDef === undefined
      ? [path, arrayPath]
      : [
          path,
          arrayPath,
          ...structDef.params.flatMap((param) =>
            collectPaths(structMap, [...arrayPath, param.name], param.attr, [
              ...ancestry,
              attr.struct,
            ]),
          ),
        ];
  }

  return attr.kind.endsWith("[]") ? [path, [...path, "[]"]] : current;
};
