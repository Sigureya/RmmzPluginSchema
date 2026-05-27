import type { StructPathError } from "./errorTypes";

export interface JSONPathErrorContext {
  pluginName: string;
  commandName: string;
  argName: string;
}

export interface BuildErrorHandlers<E> {
  structPathError(context: JSONPathErrorContext, error: StructPathError): E;
  compileJSONPathSchemaError(context: JSONPathErrorContext, error: unknown): E;
}
