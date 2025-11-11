import type {
  ArrayParamTypes,
  PluginParamEx,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "../../createPath/pathSchemaTypes";

export interface PluginValuesPathMemo {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
  arrays: ArrayPathEx[];
}

export interface ArrayPathEx {
  jsonPathJS: JSONPathJS;
  schema: PluginParamEx<ArrayParamTypes>;
}

export interface CommandMemo {
  commandName: string;
  items: PluginValuesPathMemo[];
}

export type CommandMemoPair = [commandKey: string, memo: CommandMemo];
