import { JSONValue } from '../../../../libs/jsonPath';
import { ExtractorBundle, PluginValues } from './types';
export declare const runMemoBundleEx: (value: JSONValue, memo: ReadonlyArray<ExtractorBundle>) => PluginValues[];
export declare const runMemoBundle: (value: JSONValue, memo: ExtractorBundle) => PluginValues[];
