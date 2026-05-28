import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { StructPathError } from "./createPath/types";
import { createPluginValuesPath } from "./createPath/valuePath";
import type { PluginValuesExtractorBundle } from "./extractor/types";
import type { PluginErrorStruct } from "./extractor/types/error";
import { compileJSONPathSchema } from "./pathToMemo";

export interface ParamBuildErrorHandlers<E> {
  paramStructPathError(context: ParamBuildContext, error: StructPathError): E;
  paramCompileJSONPathSchemaError(
    context: ParamBuildContext,
    error: unknown,
  ): E;
}

export interface ParamBuildContext {
  pluginName: string;
  paramName: string;
}

interface BuildSingleParamResult {
  extractor: PluginValuesExtractorBundle;
  errors: PluginErrorStruct[];
}

const collectPathErrorsForParam = <T>(
  context: ParamBuildContext,
  pathErrors: StructPathError[],
  handlers: ParamBuildErrorHandlers<T>,
): PluginErrorStruct[] => {
  return pathErrors.map((error): PluginErrorStruct => {
    return {
      code: "paramStructPathError",
      source: "createPath",
      pluginName: context.pluginName,
      paramName: context.paramName,
      message: `Path error at "${error.path}": ${error.code}`,
      info: handlers.paramStructPathError(context, error),
    };
  });
};

export const buildSingleParam = <T>(
  pluginName: string,
  param: PluginParam,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader,
  handlers: ParamBuildErrorHandlers<T>,
): BuildSingleParamResult => {
  const context: ParamBuildContext = {
    pluginName,
    paramName: param.name,
  };
  const path = createPluginValuesPath("param", "plugin", param, structMap);

  const errors: PluginErrorStruct[] = collectPathErrorsForParam(
    context,
    [...path.structs.errors, ...path.structArrays.errors],
    handlers,
  );

  try {
    return {
      extractor: compileJSONPathSchema(path, factoryFn),
      errors,
    };
  } catch (error) {
    const compileError: PluginErrorStruct = {
      code: "compileJSONPathSchemaError",
      source: "createPath",
      pluginName,
      paramName: param.name,
      message: "Failed to compile JSONPath schema",
      info: handlers.paramCompileJSONPathSchemaError(context, error),
    };
    return {
      extractor: {
        rootCategory: path.rootCategory,
        rootName: path.rootName,
        top: undefined,
        structs: [],
        structArrays: [],
      },
      errors: [...errors, compileError],
    };
  }
};
