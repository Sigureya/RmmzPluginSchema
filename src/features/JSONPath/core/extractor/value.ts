import type { PluginValues } from "./types";

export const isCommandArgValue = (value: PluginValues): boolean => {
  return value.rootType === "args";
};

export const ispluginParamValue = (value: PluginValues): boolean => {
  return value.rootType === "param";
};
