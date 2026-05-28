import type { PluginExtractedValue } from "./features";
import type { PluginExtractionError, PluginExtractionResult } from "./types";

export interface PluginParamExtractionOutput {
  pluginName: string;
  params: PluginExtractedValue[];
}

export interface PluginParamExtractionOutputWithError<E> {
  pluginName: string;
  params: PluginExtractedValue[];
  errors: PluginExtractionError<E>[];
}

export const createPluginParamsFromPipeline = (
  input: PluginExtractionResult<unknown>,
): PluginParamExtractionOutput[] => {
  return input.plugins.map(
    (plugin): PluginParamExtractionOutput => ({
      pluginName: plugin.pluginName,
      params: plugin.params,
    }),
  );
};

export const createPluginParamsWithErrorsFromPipeline = <E>(
  input: PluginExtractionResult<E>,
): PluginParamExtractionOutputWithError<E>[] => {
  return input.plugins.map(
    (plugin): PluginParamExtractionOutputWithError<E> => ({
      pluginName: plugin.pluginName,
      params: plugin.params,
      errors: plugin.errors,
    }),
  );
};
