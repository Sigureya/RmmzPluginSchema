import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginParam,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ParamBuildContext,
  StructPathError,
  ParamBuildErrorHandlers,
} from "./createPath";
import { createPluginValuesPath } from "./createPath";
import type {
  PluginValuesExtractorBundle,
  PluginErrorStruct,
} from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export interface BuildSingleParamResult {
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
    const compileError = handlers.paramCompileJSONPathSchemaError(
      context,
      error,
    );
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
