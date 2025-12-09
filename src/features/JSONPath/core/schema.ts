import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
  PluginScalarParam,
  StringArrayUnion,
  ClassifiedPluginParamsEx7,
  FileArrayParam,
  PluginSchemaArrayFiltered7Ex,
  NumberArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createClassifiedStructMap } from "@RmmzPluginSchema/rmmz/plugin";
import { compilePluginCommandExtractor } from "./command";
import { createPluginValuesPath } from "./createPath";
import type {
  CommandExtractorEntry,
  CommandMapKey,
  CommandArgExtractors,
  PluginValuesExtractorBundle7,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";
import type { PluginExtractorBundle } from "./types";

export const createPluginValueExtractor = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  pluginName: string,
  schema: PluginSchemaArrayFiltered7Ex<S, NA, SA>,

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

const compilePluginParams = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion | FileArrayParam
>(
  schema: PluginSchemaArrayFiltered7Ex<S, NA, SA>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesExtractorBundle7<S, NA, SA>[] => {
  return schema.params.map((param): PluginValuesExtractorBundle7<S, NA, SA> => {
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
