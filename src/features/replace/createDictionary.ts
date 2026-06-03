import type {
  AnyStringParam,
  PluginSchema,
  PluginSchemaArray,
  PluginStructSchemaArray,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { filterPluginSchemaByFn } from "@RmmzPluginSchema/rmmz/plugin";
import type { TargetPath } from "./handlers";

export const createTextParamDictionary = (
  { schema, pluginName }: Pick<PluginSchema, "schema" | "pluginName">,
  anyFn: (anyParam: AnyStringParam, name: string) => boolean,
): TargetPath => {
  const anyDecisionCache = precomputeAnyDecisionCache(schema, anyFn);
  const newSchema: PluginSchemaArray = filterPluginSchemaByFn(
    schema,
    (param, name) => {
      if (param.kind === "any") {
        return getAnyDecision(anyDecisionCache, param, name, anyFn);
      }
      return param.kind === "string" || param.kind === "string[]";
    },
  );
  const dictionary = createDictionary(pluginName, newSchema);
  return removeStructRootPaths(dictionary, newSchema);
};

const normalizeAnyName = (name: string): string => {
  const match = /^arg(\d+)$/.exec(name);
  return match ? `field${match[1]}` : name;
};

const precomputeAnyDecisionCache = (
  schema: PluginSchemaArray,
  anyFn: (anyParam: AnyStringParam, name: string) => boolean,
): Map<string, boolean> => {
  const cache = new Map<string, boolean>();

  schema.params.forEach((param) => {
    if (param.attr.kind === "any") {
      const key = normalizeAnyName(param.name);
      if (anyFn(param.attr, key)) {
        cache.set(key, true);
      }
    }
  });

  schema.commands.forEach((command) => {
    command.args.forEach((arg) => {
      if (arg.attr.kind === "any") {
        const key = normalizeAnyName(arg.name);
        if (!cache.has(key)) {
          if (anyFn(arg.attr, key)) {
            cache.set(key, true);
          }
        }
      }
    });
  });

  return cache;
};

const getAnyDecision = (
  cache: Map<string, boolean>,
  param: AnyStringParam,
  name: string,
  anyFn: (anyParam: AnyStringParam, name: string) => boolean,
): boolean => {
  const key = normalizeAnyName(name);
  const value = cache.get(key);
  if (value !== undefined) {
    return value;
  }
  const computed = anyFn(param, key);
  cache.set(key, computed);
  return computed;
};

const isStructKind = (kind: PrimitiveParam["kind"]): boolean => {
  return kind === "struct" || kind === "struct[]";
};

const removeStructRootPaths = (
  dictionary: TargetPath,
  schema: PluginSchemaArray,
): TargetPath => {
  const structParamNames = new Set(
    schema.params
      .filter((param) => isStructKind(param.attr.kind))
      .map((param) => param.name),
  );

  const structArgNamesByCommand = new Map<string, Set<string>>(
    schema.commands.map((command) => [
      command.command,
      new Set(
        command.args
          .filter((arg) => isStructKind(arg.attr.kind))
          .map((arg) => arg.name),
      ),
    ]),
  );

  return {
    pluginName: dictionary.pluginName,
    paramsPath: dictionary.paramsPath.filter(
      (path) => !(path.length === 1 && structParamNames.has(path[0])),
    ),
    commands: dictionary.commands.map((command) => {
      const structArgNames = structArgNamesByCommand.get(command.commandName);
      return {
        commandName: command.commandName,
        argsPath: command.argsPath.filter(
          (path) =>
            !(
              path.length === 1 &&
              structArgNames !== undefined &&
              structArgNames.has(path[0])
            ),
        ),
      };
    }),
  };
};

export const createDictionary = (
  pluginName: string,
  schema: PluginSchemaArray,
): TargetPath => {
  const structMap = new Map(schema.structs.map((s) => [s.struct, s]));
  return {
    pluginName,

    paramsPath: schema.params.flatMap((param) =>
      collectPaths(structMap, [param.name], param.attr, [], false),
    ),

    commands: schema.commands.map((command) => ({
      commandName: command.command,

      argsPath: command.args.flatMap((arg) =>
        collectPaths(structMap, [arg.name], arg.attr, [], true),
      ),
    })),
  };
};

const collectPaths = (
  structMap: ReadonlyMap<string, PluginStructSchemaArray>,
  path: string[],
  attr: PrimitiveParam,
  ancestry: string[],
  includeStructArrayRoot: boolean,
): string[][] => {
  if (attr.kind === "struct") {
    if (ancestry.includes(attr.struct)) {
      return [path];
    }

    const structDef = structMap.get(attr.struct);

    return structDef === undefined
      ? [path]
      : structDef.params.flatMap((param) =>
          collectPaths(
            structMap,
            [...path, param.name],
            param.attr,
            [...ancestry, attr.struct],
            includeStructArrayRoot,
          ),
        );
  }

  if (attr.kind === "struct[]") {
    const arrayPath = [...path, "[]"];

    if (ancestry.includes(attr.struct)) {
      return [arrayPath];
    }

    const structDef = structMap.get(attr.struct);

    if (structDef === undefined) {
      return [arrayPath];
    }

    const nested = structDef.params.flatMap((param) =>
      collectPaths(
        structMap,
        [...arrayPath, param.name],
        param.attr,
        [...ancestry, attr.struct],
        includeStructArrayRoot,
      ),
    );
    return includeStructArrayRoot ? [arrayPath, ...nested] : nested;
  }

  if (attr.kind.endsWith("[]")) {
    const arrayPath = [...path, "[]"];
    return ancestry.length === 0 ? [arrayPath] : [path, arrayPath];
  }

  return [path];
};
