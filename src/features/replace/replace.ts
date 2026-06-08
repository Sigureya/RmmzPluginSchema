import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandData,
  PluginParamsObject,
  PluginParamsRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  parseDeepRecord,
  stringifyDeepRecord,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginCommandPathMap, PluginParamPathData } from "./types";

export const replaceRuntimePluginCommand = (
  command: PluginCommandData,
  map: PluginCommandPathMap,
  replace: (value: string) => string | undefined,
): PluginCommandData => {
  const key = `${command.parameters[0]}:${command.parameters[1]}`;
  const commandPathData = map.get(key);
  if (!commandPathData) {
    return command;
  }
  const args = parseDeepRecord(command.parameters[3]);
  const replacedArgs = replacePluginValue(
    args,
    commandPathData.argsPath,
    replace,
  );

  return {
    code: command.code,
    indent: command.indent,
    parameters: [
      command.parameters[0],
      command.parameters[1],
      command.parameters[2],
      stringifyDeepRecord(replacedArgs as {}),
    ],
  };
};

export const replacePluginParams = (
  plugin: PluginParamsObject,
  map: PluginParamPathData,
  replace: (value: string) => string | undefined,
): PluginParamsRecord => {
  const parameters = replacePluginValue(
    plugin.parameters,
    map.paramsPath,
    replace,
  );
  return {
    name: plugin.name,
    status: plugin.status,
    description: plugin.description,
    parameters: stringifyDeepRecord(parameters as {}),
  };
};

export const replacePluginValue = (
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
