import type {
  PluginSchemaArray,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface DictionaryPP {
  commands: Set<string>;
  params: Set<string>;
}

export const createDictionaryPP = (schema: PluginSchemaArray): DictionaryPP => {
  const paramPaths = schema.params.reduce(
    (state, param) =>
      collectSinglePath(schema, state, param.name, param.attr, []),
    new Set<string>(),
  );
  return {
    commands: commanddsxx(schema),
    params: paramPaths,
  };
};

const commanddsxx = (schema: PluginSchemaArray) => {
  return schema.commands.reduce((state, command) => {
    return command.args.reduce((inner, arg) => {
      const path = `${command.command}.${arg.name}`;
      return collectSinglePath(schema, inner, path, arg.attr, []);
    }, state);
  }, new Set<string>());
};

const isArrayKind = (kind: string): boolean => kind.endsWith("[]");

const addPath = (set: Set<string>, path: string): Set<string> => {
  if (path.length <= 0) {
    return set;
  }
  return new Set([...set, path]);
};

const collectParamPaths = (
  schema: PluginSchemaArray,
  pathSet: Set<string>,
  prefix: string,
  structName: string,
  ancestry: readonly string[],
): Set<string> => {
  if (ancestry.includes(structName)) {
    return pathSet;
  }
  const structSchema = schema.structs.find((s) => s.struct === structName);
  if (!structSchema) {
    return pathSet;
  }
  const nextAncestry = [...ancestry, structName];
  return structSchema.params.reduce((state, param) => {
    const path = `${prefix}.${param.name}`;
    return collectSinglePath(schema, state, path, param.attr, nextAncestry);
  }, pathSet);
};

const collectSinglePath = (
  schema: PluginSchemaArray,
  state: Set<string>,
  path: string,
  attr: PrimitiveParam,
  ancestry: readonly string[],
): Set<string> => {
  const withPath = addPath(state, path);
  if (attr.kind === "struct") {
    return collectParamPaths(schema, withPath, path, attr.struct, ancestry);
  }
  if (attr.kind === "struct[]") {
    return collectParamPaths(
      schema,
      withPath,
      `${path}[]`,
      attr.struct,
      ancestry,
    );
  }
  if (isArrayKind(attr.kind)) {
    return addPath(withPath, `${path}[]`);
  }
  return withPath;
};
