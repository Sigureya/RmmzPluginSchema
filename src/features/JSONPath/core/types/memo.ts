import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "./pathSchemaTypes";

export interface PluginValuesPathMemo {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
}

export interface CommandMemo {
  commandName: string;
  items: PluginValuesPathMemo[];
}

export type CommandMemoPair = [commandKey: string, memo: CommandMemo];
