import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";

export interface PluginInfo {
  name: string;
  status: boolean;
}

export interface PluginParamsRecordMinimum {
  name: string;
  parameters: Record<string, string>;
}

export interface PluginParamsRecord
  extends PluginInfo, PluginParamsRecordMinimum {
  name: string;
  status: boolean;
  description: string;
  parameters: Record<string, string>;
}

export interface PluginParamsObject extends PluginInfo {
  name: string;
  status: boolean;
  description: string;
  parameters: Record<string, JSONValue>;
}
