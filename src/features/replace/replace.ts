import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";

export const ppxx = (
  params: Record<string, JSONValue>,
  paths: readonly (readonly string[])[],
  replace: (value: string) => string | undefined,
): Record<string, JSONValue> => {
  return paths.reduce<Record<string, JSONValue>>((parameters, path) => {
    const replaced = replacePath(parameters, path, replace);
    if (
      replaced !== null &&
      typeof replaced === "object" &&
      !Array.isArray(replaced)
    ) {
      return replaced;
    }
    return parameters;
  }, params);
};

type ReplaceFn = (value: string) => string | undefined;

const replaceLeaf = (value: JSONValue, replace: ReplaceFn): JSONValue => {
  return typeof value === "string" ? (replace(value) ?? value) : value;
};

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
    if (!Array.isArray(value)) {
      return value;
    }

    const next = value.map((item) =>
      tail.length === 0
        ? replaceLeaf(item, replace)
        : replacePath(item, tail, replace),
    );

    return next.every((item, index) => item === value[index]) ? value : next;
  }

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  if (!(head in value)) {
    return value;
  }

  const current = value[head];

  const next =
    tail.length === 0
      ? replaceLeaf(current, replace)
      : replacePath(current, tail, replace);

  if (next === current) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === head ? next : item,
    ]),
  );
};
