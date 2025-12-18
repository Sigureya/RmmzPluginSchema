import { JSONPathReader } from '../../../../../libs/jsonPath';
import { PluginArrayParamType, PluginParamEx, PrimitiveParam } from '../../../../../rmmz/plugin';
import { PluginValuesN, PluginValuesS } from './result';
export interface PluginValuesStringArray extends PluginValuesS {
    value: string;
    structName: string;
    param: PluginParamEx<StringArrayParam>;
}
export interface PluginValuesNumberArray<T extends NumberArrayParam = NumberArrayParam> extends PluginValuesN<PluginParamEx<T>> {
    value: number;
    structName: string;
    param: PluginParamEx<T>;
}
type StringArrayParam = Extract<PrimitiveParam, {
    default: string[];
}>;
type NumberArrayParam = Extract<PrimitiveParam, {
    default: number[];
}>;
export interface PluginArrayPathExtractor<T extends PluginArrayParamType> {
    jsonPathJS: JSONPathReader;
    schema: PluginParamEx<T>;
    parentType: string;
}
export {};
