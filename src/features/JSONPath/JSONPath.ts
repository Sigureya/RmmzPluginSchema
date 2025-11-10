import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
  PluginParam,
  PluginSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createStructMapclassifyed } from "@RmmzPluginSchema/rmmz/plugin";
import { createCommandArgsPath, buildCommandPathSchema } from "./pluginValue";
import type { CommandMemoPair } from "./core/value/types/JSONPathTypes";

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
        items: buildCommandPathSchema(commandPath),
      },
    ];
  });
};
