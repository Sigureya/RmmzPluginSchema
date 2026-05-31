import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginParamsObject } from "@RmmzPluginSchema/rmmz/plugin";

type ReplaceFn = (value: string) => string | undefined;

export const replaceParamV4 = (
  plugin: PluginParamsObject,
  paths: readonly (readonly string[])[],
  replace: ReplaceFn,
): PluginParamsObject => ({
  description: plugin.description,
  name: plugin.name,
  status: plugin.status,
  parameters: paths.reduce<Record<string, JSONValue>>((parameters, path) => {
    const replaced = replacePath(parameters, path, replace);
    if (
      replaced !== null &&
      typeof replaced === "object" &&
      !Array.isArray(replaced)
    ) {
      return replaced;
    }
    return parameters;
  }, plugin.parameters),
});

const replacePath = (
  value: JSONValue,
  path: ReadonlyArray<string>,
  replace: ReplaceFn,
): JSONValue => {
  if (path.length === 0) {
    return value;
  }

  const [head, ...tail] = path;

  if (head === "[]") {
    return Array.isArray(value)
      ? value.map((item) =>
          tail.length === 0
            ? replaceLeaf(item, replace)
            : replacePath(item, tail, replace),
        )
      : value;
  }

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  if (!(head in value)) {
    return value;
  }

  return {
    ...value,
    [head]:
      tail.length === 0
        ? replaceLeaf(value[head], replace)
        : replacePath(value[head], tail, replace),
  };
};

const replaceLeaf = (value: JSONValue, replace: ReplaceFn): JSONValue => {
  return typeof value === "string" ? (replace(value) ?? value) : value;
};
