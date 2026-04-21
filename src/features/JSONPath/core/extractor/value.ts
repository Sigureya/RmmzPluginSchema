import type { PluginExtractedValue } from "./types";

export const isCommandArgValue = (value: PluginExtractedValue): boolean => {
  return value.rootType === "args";
};

export const ispluginParamValue = (value: PluginExtractedValue): boolean => {
  return value.rootType === "param";
};
