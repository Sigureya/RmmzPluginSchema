import { ArrayParamTypes, ScalarParam } from '../../../../../rmmz/plugin';
import { TemplateE, TemplateG, StructPropertysPathEx3, TemplateGE } from './template';
export type StructPropertysPath = StructPropertysPathEx3<ScalarParam, ArrayParamTypes>;
export type StructPathResultWithError = TemplateGE<ScalarParam, ArrayParamTypes>;
export type PluginValuesPathWithError = TemplateE<ScalarParam, ArrayParamTypes>;
export type StructPathResultItems = TemplateG<ScalarParam, ArrayParamTypes>;
