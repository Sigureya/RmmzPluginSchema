import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandData,
  PluginParamsObject,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { CommandXX, TargetPath } from "./handlers";

type ReplaceFn = (value: string) => string | undefined;

const normalizePluginName = (name: string): string => {
  if (name.length === 0) {
    return name;
  }
  return `${name[0]?.toLowerCase() ?? ""}${name.slice(1)}`;
};

const parseToken = (
  token: string,
): { key?: string; wildcard: boolean; index?: number } => {
  if (token === "[]") {
    return { wildcard: true };
  }
  const keyWithIndex = token.match(/^(.*)\[(\d+)]$/);
  if (keyWithIndex) {
    const key = keyWithIndex[1] ?? "";
    const indexText = keyWithIndex[2] ?? "";
    const index = Number(indexText);
    if (Number.isInteger(index)) {
      return {
        key: key.length > 0 ? key : undefined,
        index,
        wildcard: false,
      };
    }
  }
  if (token.endsWith("[]")) {
    return { key: token.slice(0, -2), wildcard: true };
  }
  return { key: token, wildcard: false };
};

const replaceAtPath = (
  value: JSONValue,
  path: readonly string[],
  fn: ReplaceFn,
): JSONValue => {
  if (path.length === 0) {
    if (typeof value !== "string") {
      return value;
    }
    return fn(value) ?? value;
  }

  const [head, ...tail] = path;
  if (!head) {
    return value;
  }

  const token = parseToken(head);
  if (typeof token.index === "number") {
    if (token.key) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
      }
      const record = value as Record<string, JSONValue>;
      const current = record[token.key];
      if (!Array.isArray(current)) {
        return value;
      }
      const nextArray = current.map((item, index) => {
        if (index !== token.index) {
          return item;
        }
        return replaceAtPath(item, tail, fn);
      });
      return {
        ...record,
        [token.key]: nextArray,
      };
    }
    if (!Array.isArray(value)) {
      return value;
    }
    return value.map((item, index) => {
      if (index !== token.index) {
        return item;
      }
      return replaceAtPath(item, tail, fn);
    });
  }

  if (token.wildcard) {
    if (token.key) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
      }
      const record = value as Record<string, JSONValue>;
      const current = record[token.key];
      if (!Array.isArray(current)) {
        return value;
      }
      return {
        ...record,
        [token.key]: current.map((item) => replaceAtPath(item, tail, fn)),
      };
    }
    if (!Array.isArray(value)) {
      return value;
    }
    return value.map((item) => replaceAtPath(item, tail, fn));
  }

  if (!token.key) {
    return value;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const record = value as Record<string, JSONValue>;
  return {
    ...record,
    [token.key]: replaceAtPath(record[token.key] ?? null, tail, fn),
  };
};

const replaceCommandArgValue = (
  value: string,
  path: readonly string[],
  fn: ReplaceFn,
): string => {
  if (path.length === 0) {
    return fn(value) ?? value;
  }
  const parsed = (() => {
    try {
      return JSON.parse(value) as JSONValue;
    } catch {
      return undefined;
    }
  })();
  if (parsed === undefined) {
    return value;
  }
  const replaced = replaceAtPath(parsed, path, fn);
  return JSON.stringify(replaced);
};

export const replaceXXX3 = (
  plugin: PluginParamsObject,
  targetPath: TargetPath,
  fn: ReplaceFn,
): PluginParamsObject => {
  if (
    normalizePluginName(plugin.name) !==
    normalizePluginName(targetPath.pluginName)
  ) {
    return plugin;
  }

  const replacedParameters = targetPath.paramsPath.reduce<
    Record<string, JSONValue>
  >((state, path) => {
    if (path.length <= 0) {
      return state;
    }
    const [root, ...tail] = path;
    if (!root) {
      return state;
    }
    return {
      ...state,
      [root]: replaceAtPath(state[root] ?? null, tail, fn),
    };
  }, plugin.parameters);

  return {
    ...plugin,
    parameters: replacedParameters,
  };
};

export const replaceCommandXXX3 = (
  command: PluginCommandData,
  schema: CommandXX,
  fn: ReplaceFn,
): PluginCommandData => {
  const commandName = command.parameters[1];
  if (commandName !== schema.commandName) {
    return command;
  }

  const args = command.parameters[3];
  const replacedArgs = schema.argsPath.reduce<Record<string, string>>(
    (state, path) => {
      if (path.length <= 0) {
        return state;
      }
      const [argName, ...tail] = path;
      if (!argName) {
        return state;
      }
      const current = state[argName];
      if (typeof current !== "string") {
        return state;
      }
      return {
        ...state,
        [argName]: replaceCommandArgValue(current, tail, fn),
      };
    },
    args,
  );

  return {
    code: command.code,
    parameters: [
      command.parameters[0],
      command.parameters[1],
      command.parameters[2],
      replacedArgs,
    ],
  };
};
