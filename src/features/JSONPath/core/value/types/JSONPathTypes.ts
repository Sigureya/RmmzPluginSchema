import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "./pathSchemaTypes";

export interface CommandMemoItem {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
}

export interface CommandMemo {
  commandName: string;
  items: CommandMemoItem[];
}
