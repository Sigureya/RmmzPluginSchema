import { compilePluginParam } from "./attributes";
import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import { createDeepJSONParserHandlers } from "./deepJSONHandler";
import type {
  PluginSchemaArray,
  PluginParam,
  PluginCommandSchemaArray,
  PluginStructSchemaArray,
} from "./params";
import type {
  PluginTokens,
  PluginParamTokens,
  PluginCommandTokens,
  PluginStructTokens,
} from "./parse/types";

export type CCC = "command" | "param" | "struct";

export const compilePluginAsArraySchema = (
  parsedPlugin: PluginTokens,
  parser: DeepJSONParserHandlers = createDeepJSONParserHandlers()
): PluginSchemaArray => ({
  params: mapParams(parsedPlugin.params, parser),
  commands: mapCommands(parsedPlugin.commands, parser),
  structs: mapStructs(parsedPlugin.structs, parser),
});

const mapParams = (
  params: ReadonlyArray<PluginParamTokens>,
  parser: DeepJSONParserHandlers
): PluginParam[] => {
  return params.map((p): PluginParam => compilePluginParam(p, parser));
};

const mapCommands = (
  commands: ReadonlyArray<PluginCommandTokens>,
  parser: DeepJSONParserHandlers
): PluginCommandSchemaArray[] => {
  return commands.map(
    (cmd): PluginCommandSchemaArray => ({
      command: cmd.command,
      desc: cmd.desc,
      text: cmd.text,
      args: mapParams(cmd.args, parser),
    })
  );
};

const mapStructs = (
  structs: ReadonlyArray<PluginStructTokens>,
  parser: DeepJSONParserHandlers
): PluginStructSchemaArray[] => {
  return structs.map(
    (s): PluginStructSchemaArray => ({
      struct: s.name,
      params: mapParams(s.params, parser),
    })
  );
};
