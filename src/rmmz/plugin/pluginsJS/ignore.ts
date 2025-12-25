import type { PluginParamIgnore, PluginParamsRecord } from "./types";

export const omitPluginParam = (
  plugins: readonly PluginParamsRecord[],
  target: readonly PluginParamIgnore[]
): PluginParamsRecord[] => {
  const ignoreMap = createIgnoreMap(target);
  return plugins.map(
    (plugin): PluginParamsRecord => ({
      description: plugin.description,
      name: plugin.name,
      status: plugin.status,
      parameters: omitPluginParamXX(plugin, ignoreMap),
    })
  );
};

const omitPluginParamXX = (
  plugin: PluginParamsRecord,
  map: ReadonlyMap<string, Set<string>>
): Record<string, string> => {
  const ignoreParamSet = map.get(plugin.name);
  if (!ignoreParamSet) {
    return plugin.parameters;
  }
  const e = Object.entries<string>(plugin.parameters).filter(([key]) => {
    return !ignoreParamSet.has(key);
  });
  return Object.fromEntries<string>(e);
};

const createIgnoreMap = (
  ignoreSrc: readonly PluginParamIgnore[]
): Map<string, Set<string>> => {
  return new Map(
    ignoreSrc.map((item): [string, Set<string>] => [
      item.pluginName,
      new Set(item.params),
    ])
  );
};
