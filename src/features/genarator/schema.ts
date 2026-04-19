import type {
  PluginCommandSchemaArray,
  PluginParam,
  PluginSchemaArray,
  PluginStructSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createKeywordLine } from "./keywordLine";
import { generatePluginParamAnnotation } from "./param";
import type {
  SchemaStringifyHandlers,
  PluginSchemaAnnotation,
  PluginParamAnnotation,
  PluginStructAnnotation,
  PluginCommandAnnotation,
} from "./types";

export const generatePluginSchemaAnnotation = (
  local: string,
  schema: PluginSchemaArray,
  handlers: SchemaStringifyHandlers,
): PluginSchemaAnnotation => {
  return {
    params: paramSchemaToAnnotations(schema.params, handlers),
    structs: schema.structs.map((s) =>
      structSchemaToAnnotation(s, local, handlers),
    ),
    commands: schema.commands.map((c) =>
      commandSchemaToAnnotation(c, handlers),
    ),
  };
};

const paramSchemaToAnnotations = (
  param: ReadonlyArray<PluginParam>,
  handlers: SchemaStringifyHandlers,
): PluginParamAnnotation<"param">[] => {
  return param.map((p) => generatePluginParamAnnotation(p, "param", handlers));
};

const structSchemaToAnnotation = (
  structSchema: PluginStructSchemaArray,
  local: string,
  handlers: SchemaStringifyHandlers,
): PluginStructAnnotation => {
  return {
    locale: local,
    struct: structSchema.struct,
    params: paramSchemaToAnnotations(structSchema.params, handlers),
  };
};

const commandSchemaToAnnotation = (
  command: PluginCommandSchemaArray,
  handlers: SchemaStringifyHandlers,
): PluginCommandAnnotation => {
  return {
    desc: command.desc ? createKeywordLine("desc", command.desc) : undefined,
    text: command.text ? createKeywordLine("text", command.text) : undefined,
    command: createKeywordLine("command", command.command),
    args: command.args.map((arg) =>
      generatePluginParamAnnotation(arg, "arg", handlers),
    ),
  };
};
