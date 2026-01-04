import type { KeyWord } from "./types/keyword";
import type {
  PluginCommandAnnotation,
  PluginParamAnnotation,
  PluginStructAnnotation,
} from "./types/schema";
import type {
  PluginAnnotationTokens,
  PluginBodyBlockToken,
  StructTokenBlock,
} from "./types/tokens";

type AnnotationLineToken = "" | KeyWord<string> | undefined;

export const generateStructTokenBlock = (
  struct: PluginStructAnnotation
): StructTokenBlock => {
  const params: ("" | KeyWord<string>)[] = struct.params
    .flatMap(paramAnnotationToLines)
    .filter((x) => x !== undefined);
  return [`/*~struct~${struct.struct}:${struct.locale ?? ""}`, ...params, "*/"];
};

export const generatePluginBodyTokenBlock = (
  tokens: PluginAnnotationTokens
): PluginBodyBlockToken => {
  const lines = [
    tokens.target,
    tokens.meta.author,
    tokens.meta.pluginDesc,
    tokens.meta.url,
    "",
    ...tokens.dependencies.base,
    ...tokens.dependencies.orderBefore,
    ...tokens.dependencies.orderAfter,
    "",
    ...tokens.schema.commands.flatMap(commandAnnotationToLines),
    ...tokens.schema.params.flatMap(paramAnnotationToLines),
  ].filter((x) => x !== undefined);
  return [`/*:${tokens.locale ?? ""}`, ...lines, `*/`];
};

const commandAnnotationToLines = (
  command: PluginCommandAnnotation
): AnnotationLineToken[] => {
  return [
    command.command,
    command.text,
    command.desc,
    ...command.args.flatMap(paramAnnotationToLines),
  ];
};

const paramAnnotationToLines = (
  param: PluginParamAnnotation
): AnnotationLineToken[] => {
  return [
    param.name,
    param.base.kind,
    param.base.desc,
    ...param.attr,
    param.default,
    "",
  ];
};
