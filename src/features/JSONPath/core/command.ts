import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginSchema,
  ClassifiedPluginParams,
  PluginScalarParam,
  NumberArrayParam,
  StringArrayParam,
  PluginParamEx2,
  PluginCommandSchemaArrayFiltered,
  ClassifiedPluginParamsEx7,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPath } from "./createPath/valuePath";
import { extractAllPluginValues } from "./extractor/extractor";
import type {
  CommandArgExtractors,
  CommandExtractResult,
  CommandMapKey,
  CommandExtractorEntry,
  PluginValuesExtractorBundle7,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export function compilePluginCommandExtractor(
  pluginName: string,
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): CommandArgExtractors;

export function compilePluginCommandExtractor<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  pluginName: string,
  schema: PluginCommandSchemaArrayFiltered<PluginParamEx2<S, NA | SA>>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  factoryFn: (path: string) => JSONPathReader
): CommandArgExtractors;

export function compilePluginCommandExtractor<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  pluginName: string,
  schema: PluginCommandSchemaArrayFiltered<PluginParamEx2<S, NA | SA>>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  factoryFn: (path: string) => JSONPathReader
): CommandArgExtractors {
  return {
    pluginName,
    commandName: schema.command,
    desc: schema.desc ?? "",
    text: schema.text ?? "",
    extractors: createExtractors(schema, structMap, factoryFn),
  };
}

const createExtractors = <
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  schema: PluginCommandSchemaArrayFiltered<PluginParamEx2<S, NA | SA>>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesExtractorBundle7<
  PluginScalarParam,
  NumberArrayParam,
  StringArrayParam
>[] => {
  return schema.args.map((arg) => {
    const path = createPluginValuesPath<S, NA, SA>(
      "args",
      schema.command,
      arg,
      structMap
    );
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
    args: extractAllPluginValues(value, extractor.extractors),
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
