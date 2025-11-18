import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  CommandArgExtractors,
  CommandExtracrResult,
} from "./commandTypes";
import { createPluginValuesPathPP2 } from "./createPath/valuePath";
import { runMemoBundleEx } from "./extractor/extractor";
import type { ExtractorBundle } from "./extractor/types";
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
    const path = createPluginValuesPathPP2(
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
): CommandExtracrResult => {
  return {
    pluginName: extractor.pluginName,
    commandName: extractor.commandName,
    values: runMemoBundleEx(value, extractor.extractors),
  };
};
