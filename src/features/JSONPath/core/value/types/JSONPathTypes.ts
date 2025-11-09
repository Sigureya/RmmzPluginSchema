import type { JSONPathJS } from "jsonpath-js";
import type { StructPropertysPath } from "./pathSchemaTypes";

export interface CommandMemo {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
}
