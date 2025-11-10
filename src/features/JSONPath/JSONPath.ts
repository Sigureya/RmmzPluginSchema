import type {
  PluginSchemaArray,
  PluginParam,
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createStructMapclassifyed } from "@RmmzPluginSchema/rmmz/plugin";
import type { CommandMemoPair } from "./core/types/JSONPathTypes";
import {
  createCommandArgsPath,
  buildPluginValuesPathSchema,
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
  params: PluginParam[],
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
) => {};

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
