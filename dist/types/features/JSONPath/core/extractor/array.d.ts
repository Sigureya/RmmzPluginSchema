import { JSONValue } from '../../../../libs/jsonPath';
import { PluginScalarParam, PluginArrayParamType } from '../../../../rmmz/plugin';
import { PluginValuesExtractorBundle, PluginArrayPathExtractor, PluginValuesStringArray, PluginValuesNumberArray } from './types';
export declare const readArrayValue: <T extends PluginScalarParam, NA extends PluginArrayParamType, SA extends PluginArrayParamType>(bundle: PluginValuesExtractorBundle<T, NA | SA>, groupName: string, json: JSONValue, path: PluginArrayPathExtractor<NA>) => PluginValuesStringArray[] | PluginValuesNumberArray[];
