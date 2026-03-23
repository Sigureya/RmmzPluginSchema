import type { PluginParam } from "./types";

export const isErrorStructParam = (param: PluginParam) => {
  if (param.attr.kind === "struct" || param.attr.kind === "struct[]") {
    return Array.isArray(param.errors) ? param.errors.length > 0 : false;
  }
  return false;
};
