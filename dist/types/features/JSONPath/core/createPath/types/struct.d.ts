import { PluginArrayParamType, PluginScalarParam } from '../../../../../rmmz/plugin';
import { TemplateE, TemplateG, StructPropertiesPath, TemplateGE } from './template';
export type StructPropertysPathOld = StructPropertiesPath<PluginScalarParam, PluginArrayParamType>;
export type StructPathResultWithError = TemplateGE<PluginScalarParam, PluginArrayParamType>;
export type PluginValuesPathWithError = TemplateE<PluginScalarParam, PluginArrayParamType>;
export type StructPathResultItems = TemplateG<PluginScalarParam, PluginArrayParamType>;
