import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
  PluginSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginCommandExtractor } from "./command";
import { createPluginValuesPath } from "./createPath";
import type {
  ExtractorBundle,
  CommandExtractorEntry,
  CommandMapKey,
  CommandArgExtractors,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";
import type { PluginExtractorBundle } from "./types";

export const createPluginValueExtractor = (
  pluginName: string,
  schema: PluginSchemaArray,
  factoryFn: (path: string) => JSONPathReader
): PluginExtractorBundle => {
  const structMap = createClassifiedStructMap(schema.structs);
  return {
    params: compilePluginParams(schema, structMap, factoryFn),
    commands: compilePluginCommands(
      pluginName,
      schema.commands,
      structMap,
      factoryFn
    ),
  };
};

const compilePluginParams = (
  schema: PluginSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): ExtractorBundle[] => {
  return schema.params.map((param): ExtractorBundle => {
    const path = createPluginValuesPath("param", param.name, param, structMap);
    return compileJSONPathSchema(path, factoryFn);
  });
};

const compilePluginCommands = (
  pluginName: string,
  commands: PluginCommandSchemaArray[],
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): CommandExtractorEntry[] => {
  return commands.map((cmd): [CommandMapKey, CommandArgExtractors] => [
    `${pluginName}:${cmd.command}`,
    compilePluginCommandExtractor(pluginName, cmd, structMap, factoryFn),
  ]);
};
