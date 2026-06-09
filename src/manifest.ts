import type { PluginCommandPathMap, PluginReplacePathData } from "./features";
import { createPluginParamDictionary, replacePluginValue } from "./features";
import { createPluginCommandMap } from "./features/replace/build";
import type {
  DeepJSONValue,
  PluginParamsObject,
  PluginParamsRecord,
  PluginTextSchema,
} from "./rmmz";
import { stringifyDeepRecord } from "./rmmz";

export interface PluginManifestData extends PluginReplacePathData {
  pluginName: string;
  desc: string;
  params: Record<string, DeepJSONValue>;
}

export const createManifestData = (
  plugin: PluginParamsObject,
  schema: PluginTextSchema,
  hashFn: (str: string) => string,
): PluginManifestData => {
  const dic = createPluginParamDictionary(plugin.name, schema);
  const newValues = replacePluginValue(
    plugin.parameters,
    dic.paramsPath,
    hashFn,
  );
  return {
    pluginName: plugin.name,
    desc: plugin.description,
    commands: dic.commands,
    paramsPath: dic.paramsPath,
    params: newValues,
  };
};

export const buildRuntimeData = (
  data: PluginManifestData,
  dictionryFn: (hash: string) => string | undefined,
): PluginParamsRecord => {
  const newParams: Record<string, DeepJSONValue> = replacePluginValue(
    data.params,
    data.paramsPath,
    dictionryFn,
  );
  return {
    description: data.desc,
    name: data.pluginName,
    parameters: stringifyDeepRecord(newParams),
    status: true,
  };
};

export const createPluginCommandMapFromManifestData = (
  data: ReadonlyArray<PluginManifestData>,
): PluginCommandPathMap => {
  return createPluginCommandMap(data);
};
