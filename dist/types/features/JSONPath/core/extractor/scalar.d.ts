import { JSONValue, JSONPathReader } from '../../../../libs/jsonPath';
import { PluginScalarParam, PluginArrayParamType } from '../../../../rmmz/plugin';
import { PluginValuesExtractorBundle, PluginValueScalar } from './types';
export declare const readScalarValue: <T extends PluginScalarParam>(bundle: PluginValuesExtractorBundle<T, PluginArrayParamType>, structName: string, json: Record<string, JSONValue>, jsonPath: JSONPathReader, record: Record<string, T>) => PluginValueScalar<T>[];
