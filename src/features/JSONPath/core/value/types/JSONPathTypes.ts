import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "./pathSchemaTypes";

export interface CommandMemoItems {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
}

export interface CommandMemo {
  commandName: string;
  items: CommandMemoItems[];
}
