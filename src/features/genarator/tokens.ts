import type { KeyWord } from "./types/keyword";
import type {
  PluginCommandAnnotation,
  PluginParamAnnotation,
  PluginStructAnnotation,
} from "./types/schema";
import type {
  AnnotationTokens,
  PluginBodyBlockToken,
  StructTokenBlock,
} from "./types/tokens";

type TokenLine = "" | KeyWord<string> | undefined;

export const createStructTokens = (
  struct: PluginStructAnnotation
): StructTokenBlock => {
  const params: ("" | KeyWord<string>)[] = struct.params
    .flatMap(ppp)
    .filter((x) => x !== undefined);
  return [`/*~struct~${struct.struct}:${struct.locale ?? ""}`, ...params, "*/"];
};

export const ganerateBodyTokens = (
  tokens: AnnotationTokens
): PluginBodyBlockToken => {
  const lines = [
    tokens.meta.author,
    tokens.meta.pluginDesc,
    tokens.meta.url,
    tokens.target,
    ...tokens.dependencies.base,
    ...tokens.dependencies.orderBefore,
    ...tokens.dependencies.orderAfter,
    ...tokens.schema.commands.flatMap(ccc),
    ...tokens.schema.params.flatMap(ppp),
  ].filter((x) => x !== undefined);
  return [`/*:${tokens.locale ?? ""}`, ...lines, `*/`];
};

const ccc = (command: PluginCommandAnnotation): TokenLine[] => {
  return [
    command.command,
    command.text,
    command.desc,
    ...command.args.flatMap(ppp),
  ];
};

const ppp = (param: PluginParamAnnotation): TokenLine[] => {
  return [
    param.name,
    param.base.kind,
    param.base.desc,
    ...param.attr,
    param.default,
    "",
  ];
};
