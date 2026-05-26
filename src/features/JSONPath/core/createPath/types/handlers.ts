import type { StructPathError } from "./errorTypes";

export interface BuildErrorHandlers<E> {
  structPathError(
    context: {
      pluginName: string;
      commandName: string;
      argName: string;
    },
    error: StructPathError,
  ): E;
  compileJSONPathSchemaError(
    context: {
      pluginName: string;
      commandName: string;
      argName: string;
    },
    error: unknown,
  ): E;
}
