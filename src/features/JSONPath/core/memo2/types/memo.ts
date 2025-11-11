import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "../../createPath/pathSchemaTypes";
import type { ArrayPathMemo } from "./array";

export interface PluginValuesPathMemo {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
  arrays: ArrayPathMemo[];
}

export interface CommandMemo {
  commandName: string;
  items: PluginValuesPathMemo[];
}

export type CommandMemoPair = [commandKey: string, memo: CommandMemo];
