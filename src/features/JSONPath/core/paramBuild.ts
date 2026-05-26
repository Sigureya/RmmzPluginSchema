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

export interface ParamBuildResult<T = PluginErrorStruct> {
  extractors: PluginValuesExtractorBundle[];
  errors: T[];
}

export interface ParamBuildErrorHandlers<E> {
  structPathError(context: ParamBuildContext, error: StructPathError): E;
  compileJSONPathSchemaError(context: ParamBuildContext, error: unknown): E;
}

export interface ParamBuildContext {
  pluginName: string;
  paramName: string;
}

interface BuildSingleParamResult {
  extractor: PluginValuesExtractorBundle;
  errors: PluginErrorStruct[];
}

export const defaultParamBuildHandlers: ParamBuildErrorHandlers<PluginErrorStruct> =
  {
    structPathError: (context, error) => ({
      code: error.code,
      source: "createPath",
      pluginName: context.pluginName,
      paramName: context.paramName,
      path: error.path,
      message: `${error.code}: ${error.path}`,
    }),
    compileJSONPathSchemaError: (context, error) => ({
      code: "compile_jsonpath_schema_error",
      source: "compileJSONPathSchema",
      pluginName: context.pluginName,
      paramName: context.paramName,
      message: String(error),
    }),
  };

const collectPathErrorsForParam = (
  context: ParamBuildContext,
  pathErrors: StructPathError[],
  handlers: ParamBuildErrorHandlers<PluginErrorStruct>,
): PluginErrorStruct[] => {
  return pathErrors.map((error) => handlers.structPathError(context, error));
};

export const buildSingleParam = (
  pluginName: string,
  param: PluginParam,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader,
  handlers: ParamBuildErrorHandlers<PluginErrorStruct>,
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
    return {
      extractor: compileJSONPathSchema(
        {
          ...path,
          structs: { items: [], errors: [] },
          structArrays: { items: [], errors: [] },
        },
        factoryFn,
      ),
      errors: [...errors, handlers.compileJSONPathSchemaError(context, error)],
    };
  }
};
