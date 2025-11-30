import { JSONValue } from '../../../../libs/jsonPath';
import { ExtractorBundle, PluginValues } from './types';
export declare const extractAllPluginValues: (value: JSONValue, memo: ReadonlyArray<ExtractorBundle>) => PluginValues[];
