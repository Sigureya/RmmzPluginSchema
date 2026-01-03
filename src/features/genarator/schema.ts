import type {
  PluginCommandSchemaArray,
  PluginParam,
  PluginSchemaArray,
  PluginStructSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createKeywordLine } from "./keywordLine";
import { genaratePluginParam } from "./param";
import type {
  PluginCommandAnnotation,
  PluginParamAnnotation,
  PluginSchemaAnnotation,
  PluginStructAnnotation,
} from "./types/schema";
import type { StringifyXX } from "./types/stringlfy";

export const generatePluginSchemaAnnotation = (
  schema: PluginSchemaArray,
  handlers: StringifyXX
): PluginSchemaAnnotation => {
  return {
    params: mapParams(schema.params, handlers),
    structs: schema.structs.map((s) => mapStructParams(s, handlers)),
    commands: schema.commands.map((c) => mapCommands(c, handlers)),
  };
};

const mapParams = (
  param: ReadonlyArray<PluginParam>,
  handlers: StringifyXX
): PluginParamAnnotation<"param">[] => {
  return param.map((p) => genaratePluginParam(p, "param", handlers));
};

const mapStructParams = (
  structSchema: PluginStructSchemaArray,
  handlers: StringifyXX
): PluginStructAnnotation => {
  return {
    struct: createKeywordLine("struct", structSchema.struct),
    params: mapParams(structSchema.params, handlers),
  };
};

const mapCommands = (
  command: PluginCommandSchemaArray,
  handlers: StringifyXX
): PluginCommandAnnotation => {
  return {
    command: createKeywordLine("command", command.command),
    args: command.args.map((arg) => genaratePluginParam(arg, "arg", handlers)),
  };
};
