import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginArrayParamType,
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
  PluginParamEx2,
  PluginSchemaArray,
  PluginSchemaArrayFiltered,
  PluginScalarParam,
  PluginMinimumSchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginCommandExtractor } from "./command";
import { createPluginValuesPath } from "./createPath";
import type {
  PluginValuesExtractorBundle,
  CommandExtractorEntry,
  CommandMapKey,
  CommandArgExtractors,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";
import type { PluginExtractorBundle } from "./types";

export const createPluginCommandExtractor = (
  schema: PluginMinimumSchema,
  factoryFn: (path: string) => JSONPathReader
): CommandExtractorEntry[] => {
  const structMap = createClassifiedStructMap(schema.schema.structs);
  return compilePluginCommands(
    schema.pluginName,
    schema.schema.commands,
    structMap,
    factoryFn
  );
};

export const createPluginValueExtractor = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  pluginName: string,
  schema: PluginSchemaArrayFiltered<PluginParamEx2<S, A>>,
  factoryFn: (path: string) => JSONPathReader
): PluginExtractorBundle => {
  const structMap = createClassifiedStructMap(schema.structs);
  return {
    pluginName: pluginName,
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
): PluginValuesExtractorBundle[] => {
  return schema.params.map((param): PluginValuesExtractorBundle => {
    const path = createPluginValuesPath("param", param.name, param, structMap);
    return compileJSONPathSchema(path, factoryFn);
  });
};

const compilePluginCommands = (
  pluginName: string,
  commands: readonly PluginCommandSchemaArray[],
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): CommandExtractorEntry[] => {
  return commands.map((cmd): [CommandMapKey, CommandArgExtractors] => [
    `${pluginName}:${cmd.command}`,
    compilePluginCommandExtractor(pluginName, cmd, structMap, factoryFn),
  ]);
};
