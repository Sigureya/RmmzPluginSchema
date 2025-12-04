import { JSONPathReader } from '../../../../../libs/jsonPath';
import { PluginArrayParamType, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginArrayPathExtractor } from './array';
import { ValueCategory2 } from './result';
export interface PluginValuesPathMemo<S extends PluginScalarParam, A extends PluginArrayParamType> {
    scalar?: PluginScalarValueExtractor<S>;
    arrays: PluginArrayPathExtractor<A>[];
    bundleName: string;
}
export interface PluginScalarValueExtractor<S extends PluginScalarParam> {
    jsonPathJS: JSONPathReader;
    record: Record<string, S>;
}
/**
 * @deprecated use PluginValuesExtractorBundle instead
 */
export type ExtractorBundle = PluginValuesExtractorBundle<PluginScalarParam, PluginArrayParamType>;
export interface PluginValuesExtractorBundle<S extends PluginScalarParam = PluginScalarParam, A extends PluginArrayParamType = PluginArrayParamType> {
    rootName: string;
    rootCategory: ValueCategory2;
    top: PluginValuesPathMemo<S, A> | undefined;
    structs: PluginValuesPathMemo<S, A>[];
    structArrays: PluginValuesPathMemo<S, A>[];
}
