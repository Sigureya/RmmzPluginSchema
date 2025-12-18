import { PluginParamEx, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginValues } from './result';
export type PluginValueScalar<T extends PluginScalarParam> = PluginValues<PluginParamEx<T>>;
