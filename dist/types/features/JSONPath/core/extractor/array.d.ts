import { JSONValue } from '../../../../libs/jsonPath';
import { ScalarParam, ArrayParamTypes } from '../../../../rmmz/plugin';
import { ExtractorBundle, ArrayPathExtractor, PluginValuesStringArray, PluginValuesNumberArray } from './types';
export declare const readArrayValue: <T extends ScalarParam, NA extends ArrayParamTypes, SA extends ArrayParamTypes>(bundle: ExtractorBundle<T, NA | SA>, groupName: string, json: JSONValue, path: ArrayPathExtractor<NA>) => PluginValuesStringArray[] | PluginValuesNumberArray[];
