import { PluginScalarParam, PluginArrayParamType, PluginParam, ClassifiedPluginFileParams, ClassifiedTextParams, ClassifiedPluginParamsEx2, PluginParamEx2, ClassifiedPluginParams } from './types';
export declare function classifyPluginParams(params: ReadonlyArray<PluginParam>): ClassifiedPluginParams;
export declare function classifyPluginParams<S extends PluginScalarParam, A extends PluginArrayParamType>(params: ReadonlyArray<PluginParamEx2<S, A>>): ClassifiedPluginParamsEx2<S, A>;
export declare const classifyFileParams: (params: ReadonlyArray<PluginParam>) => ClassifiedPluginFileParams;
export declare const classifyTextParams: (params: ReadonlyArray<PluginParam>) => ClassifiedTextParams;
