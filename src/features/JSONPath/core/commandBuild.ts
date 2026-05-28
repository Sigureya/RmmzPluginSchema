import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { StructPathError } from "./createPath/types";
import type { CommandBuildErrorHandlers } from "./createPath/types/handlers";
import { createPluginValuesPath } from "./createPath/valuePath";
import type { CommandArgExtractors } from "./extractor/types";
import type { ErrorStruct } from "./extractor/types/error";
import { compileJSONPathSchema } from "./pathToMemo";

export const defaultCommandBuildErrorHandlers: CommandBuildErrorHandlers<ErrorStruct> =
  {
    commandStructPathError: (context, error: StructPathError) => ({
      code: error.code,
      source: "createPath",
      pluginName: context.pluginName,
      commandName: context.commandName,
      argName: context.argName,
      path: error.path,
      message: `${error.code}: ${error.path}`,
    }),
    commandCompileJSONPathSchemaError: (context, error: unknown) => ({
      code: "compile_jsonpath_schema_error",
      source: "compileJSONPathSchema",
      pluginName: context.pluginName,
      commandName: context.commandName,
      argName: context.argName,
      message: String(error),
    }),
  };

const collectPathErrors = (
  pluginName: string,
  commandName: string,
  argName: string,
  pathErrors: StructPathError[],
  handlers: CommandBuildErrorHandlers<ErrorStruct>,
): ErrorStruct[] => {
  const context = { pluginName, commandName, argName };
  return pathErrors.map((error) =>
    handlers.commandStructPathError(context, error),
  );
};

export const buildSingleCommand = (
  pluginName: string,
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader,
  handlers: CommandBuildErrorHandlers<ErrorStruct>,
): { extractor: CommandArgExtractors; errors: ErrorStruct[] } => {
  const errors: ErrorStruct[] = [];

  const extractors = schema.args.flatMap((arg) => {
    const path = createPluginValuesPath("args", schema.command, arg, structMap);
    errors.push(
      ...collectPathErrors(
        pluginName,
        schema.command,
        arg.name,
        [...path.structs.errors, ...path.structArrays.errors],
        handlers,
      ),
    );

    try {
      return [compileJSONPathSchema(path, factoryFn)];
    } catch (error) {
      errors.push(
        handlers.commandCompileJSONPathSchemaError(
          {
            pluginName,
            commandName: schema.command,
            argName: arg.name,
          },
          error,
        ),
      );
      return [];
    }
  });

  return {
    extractor: {
      pluginName,
      commandName: schema.command,
      desc: schema.desc ?? "",
      text: schema.text ?? "",
      extractors,
    },
    errors,
  };
};
