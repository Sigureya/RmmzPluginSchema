import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";

export interface PluginParamsRecord {
  name: string;
  status: boolean;
  description: string;
  parameters: Record<string, string>;
}

export interface PluginParamsObject {
  name: string;
  status: boolean;
  description: string;
  parameters: Record<string, JSONValue>;
}
