import { compileAttributes } from "./attributes";
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
  StructParseState,
} from "./parse/types";
import { parseDeepJSON } from "./rmmzJSON";

export type CCC = "command" | "param" | "struct";

export const compilePluginAsArraySchema = (
  parsedPlugin: PluginTokens,
  fn: (structDefault: string, category: CCC) => unknown = (s: string) =>
    parseDeepJSON(s)
): PluginSchemaArray => ({
  params: mapParams(parsedPlugin.params, (text: string) => fn(text, "param")),
  commands: mapCommands(parsedPlugin.commands, (text: string) =>
    fn(text, "command")
  ),
  structs: mapStructs(parsedPlugin.structs, (text: string) =>
    fn(text, "struct")
  ),
});

const mapParams = (
  params: ReadonlyArray<PluginParamTokens>,
  fn: (structDefault: string) => unknown
): PluginParam[] => {
  return params.map(
    (p): PluginParam => ({
      name: p.name,
      attr: compileAttributes(p, fn),
    })
  );
};

const mapCommands = (
  commands: ReadonlyArray<PluginCommandTokens>,
  fn: (structDefault: string) => unknown
): PluginCommandSchemaArray[] => {
  return commands.map(
    (cmd): PluginCommandSchemaArray => ({
      command: cmd.command,
      desc: cmd.desc,
      text: cmd.text,
      args: mapParams(cmd.args, fn),
    })
  );
};

const mapStructs = (
  structs: ReadonlyArray<StructParseState>,
  fn: (structDefault: string) => unknown
): PluginStructSchemaArray[] => {
  return structs.map(
    (s): PluginStructSchemaArray => ({
      struct: s.name,
      params: mapParams(s.params, fn),
    })
  );
};
