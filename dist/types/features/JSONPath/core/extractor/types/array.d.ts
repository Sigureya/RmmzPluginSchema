import { JSONPathReader } from '../../../../../libs/jsonPath';
import { ArrayParamTypes, PluginParamEx, PrimitiveParam } from '../../../../../rmmz/plugin';
import { PluginValues, ValueCategory2 } from './result';
export interface PluginValuesStringArray extends PluginValues {
    value: string;
    category: ValueCategory2;
    name: string;
    param: PluginParamEx<StringArrayParam>;
}
export interface PluginValuesNumberArray<T extends NumberArrayParam = NumberArrayParam> extends PluginValues {
    value: number;
    category: ValueCategory2;
    name: string;
    param: PluginParamEx<T>;
}
type StringArrayParam = Extract<PrimitiveParam, {
    default: string[];
}>;
type NumberArrayParam = Extract<PrimitiveParam, {
    default: number[];
}>;
export interface ArrayPathExtractor<T extends ArrayParamTypes = ArrayParamTypes> {
    jsonPathJS: JSONPathReader;
    schema: PluginParamEx<T>;
    parentType: string;
}
export {};
