import type { StructPathError } from "./errorTypes";

export interface CommandBuildContext {
  pluginName: string;
  commandName: string;
  argName: string;
}

export interface CommandBuildErrorHandlers<E> {
  commandStructPathError(
    context: CommandBuildContext,
    error: StructPathError,
  ): E;
  commandCompileJSONPathSchemaError(
    context: CommandBuildContext,
    error: unknown,
  ): E;
}
