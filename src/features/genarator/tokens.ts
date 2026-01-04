import type { KeyWord } from "./types/keyword";
import type {
  PluginCommandAnnotation,
  PluginParamAnnotation,
  PluginSchemaAnnotation,
  PluginStructAnnotation,
} from "./types/schema";
import type { AnnotationTokens } from "./types/tokens";

type TokenLine = "" | KeyWord<string> | undefined;

export const createStructTokens = (struct: PluginStructAnnotation) => {
  return [
    `/*~struct~${struct.struct}:${struct.locale ?? ""}`,
    ...struct.params.flatMap(ppp),
    "*/",
  ].filter((x) => x !== undefined);
};

const ganerateTokens = (tokens: AnnotationTokens) => {
  return [
    tokens.meta.author,
    tokens.meta.pluginDesc,
    tokens.meta.url,
    tokens.target,
    tokens.dependencies.base,
    tokens.dependencies.orderBefore,
    tokens.dependencies.orderAfter,
    tokens.schema.commands.flatMap(ccc),
    tokens.schema.params.flatMap(ppp),
  ];
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
