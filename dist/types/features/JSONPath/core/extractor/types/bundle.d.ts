import { JSONPathReader } from '../../../../../libs/jsonPath';
import { ScalarParam } from '../../../../../rmmz/plugin';
import { ArrayPathExtractor } from './array';
import { ValueCategory2 } from './result';
export interface PluginValuesPathMemo4 {
    scalar?: ScalarValueExtractor;
    arrays: ArrayPathExtractor[];
    bundleName: string;
}
export interface ScalarValueExtractor {
    jsonPathJS: JSONPathReader;
    record: Record<string, ScalarParam>;
}
export interface ExtractorBundle {
    rootName: string;
    rootCategory: ValueCategory2;
    top: PluginValuesPathMemo4 | undefined;
    structs: PluginValuesPathMemo4[];
    structArrays: PluginValuesPathMemo4[];
}
