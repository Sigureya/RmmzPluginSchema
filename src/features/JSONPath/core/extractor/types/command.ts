import type {
  NumberArrayParam,
  PluginScalarParam,
  StringArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesExtractorBundle7 } from "./bundle";
import type { PluginValues } from "./result";

export interface CommandArgExtractors {
  pluginName: string;
  commandName: string;
  desc: string;
  text: string;
  extractors: PluginValuesExtractorBundle7<
    PluginScalarParam,
    NumberArrayParam,
    StringArrayParam
  >[];
}

export interface CommandExtractResult {
  pluginName: string;
  commandName: string;
  args: PluginValues[];
}

export type CommandMapKey = `${string}:${string}`;
export type CommandExtractorEntry = [CommandMapKey, CommandArgExtractors];
