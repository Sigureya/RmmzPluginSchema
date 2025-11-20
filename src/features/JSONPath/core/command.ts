import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type { PluginSchemaV2 } from "@RmmzPluginSchema/rmmz/plugin";
import {
  type PluginCommandSchemaArray,
  type ClassifiedPluginParams,
  createStructMapclassifyed,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  CommandArgExtractors,
  CommandExtracrResult,
  CommandMapKey,
  CommandPairXXX,
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

export const compilePluginCommandExtractorsEx = (
  plugins: ReadonlyArray<PluginSchemaV2>,
  factoryFn: (path: string) => JSONPathReader
): Map<CommandMapKey, CommandArgExtractors> => {
  return new Map(plugins.flatMap((p) => compile(p, factoryFn)));
};

const compile = (
  plugin: PluginSchemaV2,
  factoryFn: (path: string) => JSONPathReader
): CommandPairXXX[] => {
  type MapType = ReadonlyMap<string, ClassifiedPluginParams>;
  const structMap: MapType = createStructMapclassifyed(plugin.schema.structs);
  return plugin.schema.commands.map(
    (cmd): CommandPairXXX => [
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
