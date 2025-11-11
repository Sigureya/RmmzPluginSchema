import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { StructPropertysPath } from "../../createPath/pathSchemaTypes";
import type { ArrayPathMemo } from "./array";

export interface PluginValuesPathMemo {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathReader;
  arrays: ArrayPathMemo[];
}

export interface CommandMemo {
  commandName: string;
  items: PluginValuesPathMemo[];
}

export type CommandMemoPair = [commandKey: string, memo: CommandMemo];
