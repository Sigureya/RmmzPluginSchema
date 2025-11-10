import type {
  PluginSchemaArray,
  PluginParam,
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  classifyPluginParams,
  createStructMapclassifyed,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./core";
import type { CommandMemoPair } from "./core/types/JSONPathTypes";
import {
  createCommandArgsPath,
  buildPluginValuesPathSchema,
  createPluginParamsPath,
} from "./pluginValue";

export const createCommandMemoEx = (
  pluginName: string,
  bundle: PluginSchemaArray
): CommandMemoPair[] => {
  const structMap = createStructMapclassifyed(bundle.structs);
  return createCommandMemo(pluginName, bundle.commands, structMap);
};

const createParamsPath = (
  pluginName: string,
  params: ReadonlyArray<PluginParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
) => {
  const cpp: ClassifiedPluginParams = classifyPluginParams(params);
  //  createPluginParamsPath(params, structMap);
  return createPluginValuesPath("param", pluginName, cpp, structMap);
};

export const createCommandMemo = (
  pluginName: string,
  commands: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): CommandMemoPair[] => {
  return commands.map((schema): CommandMemoPair => {
    const commandPath = createCommandArgsPath(schema, structMap);
    return [
      `${schema.command}:${pluginName}`,
      {
        commandName: schema.command,
        items: buildPluginValuesPathSchema(commandPath),
      },
    ];
  });
};
