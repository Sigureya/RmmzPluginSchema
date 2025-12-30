import { compileAttributes } from "./attributes";
import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import { createDeepJSONParserHandlers } from "./deepJSONHandler";
import type { PrimitiveParam } from "./params";
import { parsePlugin } from "./parse/parse";
import type {
  ParsedPlugin,
  PluginCommandTokens,
  PluginParamTokens,
  StructParseState,
} from "./parse/types/types";
import type {
  PluginCommandBody,
  PluginJSON,
  PluginStructBody,
} from "./pluginJSONTypes";

export const compilePluginToObject = (text: string): PluginJSON => {
  return compilePluginToObjectCore(parsePlugin(text));
};

const compilePluginToObjectCore = (parsedPlugin: ParsedPlugin): PluginJSON => {
  const handlers = createDeepJSONParserHandlers();
  return {
    target: "MZ",
    meta: parsedPlugin.meta,
    commands: reduceCommands(parsedPlugin.commands, handlers),
    params: reduceParams(parsedPlugin.params, handlers),
    structs: reduceStructs(parsedPlugin.structs, handlers),
  };
};

const reduceParams = (
  paramTokens: ReadonlyArray<PluginParamTokens>,
  handlers: DeepJSONParserHandlers
): { [key: string]: PrimitiveParam } => {
  return Object.fromEntries(
    paramTokens.map((param): [string, PrimitiveParam] => [
      param.name,
      compileAttributes(param, handlers),
    ])
  );
};

const reduceCommands = (
  tokens: ReadonlyArray<PluginCommandTokens>,
  handlers: DeepJSONParserHandlers
): Record<string, PluginCommandBody> => {
  return Object.fromEntries(
    tokens.map((token): [string, PluginCommandBody] => [
      token.command,
      {
        desc: token.desc,
        text: token.text,
        args: reduceParams(token.args, handlers),
      },
    ])
  );
};

const reduceStructs = (
  structs: ReadonlyArray<StructParseState>,
  handlers: DeepJSONParserHandlers
): Record<string, PluginStructBody> => {
  return Object.fromEntries(
    structs.map((struct): [string, PluginStructBody] => [
      struct.name,
      {
        params: reduceParams(struct.params, handlers),
      },
    ])
  );
};
