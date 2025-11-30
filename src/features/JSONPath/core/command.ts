import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginSchema,
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./createPath/valuePath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  CommandArgExtractors,
  CommandExtractResult,
  CommandMapKey,
  CommandExtractorEntry,
  ExtractorBundle,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const compilePluginCommandExtractor = (
  pluginName: string,
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): CommandArgExtractors => {
  return {
    pluginName,
    commandName: schema.command,
    desc: schema.desc ?? "",
    text: schema.text ?? "",
    extractors: createExtractors(schema, structMap, factoryFn),
  };
};

const createExtractors = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): ExtractorBundle[] => {
  return schema.args.map((arg): ExtractorBundle => {
    const path = createPluginValuesPath("args", schema.command, arg, structMap);
    return compileJSONPathSchema(path, factoryFn);
  });
};

export const extractPluginCommandArgs = (
  value: JSONValue,
  extractor: CommandArgExtractors
): CommandExtractResult => {
  return {
    pluginName: extractor.pluginName,
    commandName: extractor.commandName,
    values: extractAllPluginValues(value, extractor.extractors),
  };
};

export const extractCommandArgsByKey = (
  value: JSONValue,
  key: CommandMapKey,
  map: ReadonlyMap<CommandMapKey, CommandArgExtractors>
): CommandExtractResult | undefined => {
  const extractor = map.get(key);
  if (!extractor) {
    return undefined;
  }
  return extractPluginCommandArgs(value, extractor);
};

/**
 * @deprecated
 */
export const compileCommandExtractorsFromPlugins = (
  plugins: ReadonlyArray<PluginSchema>,
  factoryFn: (path: string) => JSONPathReader
): Map<CommandMapKey, CommandArgExtractors> => {
  return new Map(
    plugins.flatMap((p) => compilePluginCommandPairs(p, factoryFn))
  );
};

/**
 * @deprecated
 */
export const compilePluginCommandPairs = (
  plugin: PluginSchema,
  factoryFn: (path: string) => JSONPathReader
): CommandExtractorEntry[] => {
  type MapType = ReadonlyMap<string, ClassifiedPluginParams>;
  const structMap: MapType = createClassifiedStructMap(plugin.schema.structs);
  return plugin.schema.commands.map(
    (cmd): CommandExtractorEntry => [
      `${plugin.pluginName}:${cmd.command}`,
      compilePluginCommandExtractor(
        plugin.pluginName,
        cmd,
        structMap,
        factoryFn
      ),
    ]
  );
};
