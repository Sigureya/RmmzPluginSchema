import { JSONValue, JSONPathReader } from '../../../../libs/jsonPath';
import { ScalarParam, ArrayParamTypes } from '../../../../rmmz/plugin';
import { ExtractorBundle, PluginValueScalar } from './types';
export declare const readScalarValue: <T extends ScalarParam>(bundle: ExtractorBundle<T, ArrayParamTypes>, structName: string, json: JSONValue, jsonPath: JSONPathReader, record: Record<string, T>) => PluginValueScalar<T>[];
