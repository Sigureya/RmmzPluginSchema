import { PluginParamEx, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginValues } from './result';
export interface PluginValueScalar<T extends PluginScalarParam> extends PluginValues {
    value: number | string | boolean;
    structName: string;
    param: PluginParamEx<T>;
}
