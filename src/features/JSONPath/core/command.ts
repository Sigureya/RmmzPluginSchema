import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginSchema,
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
  PluginArrayParamType,
  PluginScalarParam,
  ClassifiedPluginParamsEx2,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./createPath/valuePath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  CommandArgExtractors,
  CommandExtractResult,
  CommandMapKey,
  CommandExtractorEntry,
  PluginValuesExtractorBundle,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const compilePluginCommandExtractor = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  pluginName: string,
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>,
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
  structMap: ReadonlyMap<
    string,
    ClassifiedPluginParamsEx2<PluginScalarParam, PluginArrayParamType>
  >,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesExtractorBundle[] => {
  return schema.args.map((arg): PluginValuesExtractorBundle => {
    const path = createPluginValuesPath("args", schema.command, arg, structMap);
    return compileJSONPathSchema(path, factoryFn);
  });
};

export const extractPluginCommandArgs = (
  value: Record<string, JSONValue>,
  extractor: CommandArgExtractors
): CommandExtractResult => {
  return {
    pluginName: extractor.pluginName,
    commandName: extractor.commandName,
    args: extractAllPluginValues(value, extractor.extractors),
  };
};

export const extractCommandArgsByKey = (
  value: Record<string, JSONValue>,
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
