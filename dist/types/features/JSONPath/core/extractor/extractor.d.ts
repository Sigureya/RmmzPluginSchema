import { JSONValue } from '../../../../libs/jsonPath';
import { PluginValuesExtractorBundle, PluginValues } from './types';
export declare const extractAllPluginValues: (value: JSONValue, memo: ReadonlyArray<PluginValuesExtractorBundle>) => PluginValues[];
