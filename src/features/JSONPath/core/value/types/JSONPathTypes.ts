import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "./pathSchemaTypes";

export interface pluginValuesPath {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
}

export interface CommandMemo {
  commandName: string;
  items: pluginValuesPath[];
}

export type CommandMemoPair = [commandKey: string, memo: CommandMemo];
