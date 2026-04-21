import { PluginParamEx, PluginScalarParam } from '../../../../../rmmz/plugin';
import { PluginExtractedValue } from './result';
export type PluginValueScalar<T extends PluginScalarParam> = PluginExtractedValue<PluginParamEx<T>>;
