import { PrimitiveParam, PluginJSON } from '../../rmmz/plugin';
import { FilteredPluginSchema } from './filtedTypes';
export declare const filterPluginSchemaByParam: <T extends PrimitiveParam>(p: PluginJSON, fn: (param: PrimitiveParam) => param is T) => FilteredPluginSchema<T>;
