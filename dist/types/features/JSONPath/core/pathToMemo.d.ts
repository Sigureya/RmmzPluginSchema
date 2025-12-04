import { JSONPathReader } from '../../../libs/jsonPath';
import { PluginArrayParamType, PluginScalarParam } from '../../../rmmz/plugin';
import { PluginValuesPathSchema } from './createPath/types';
import { PluginValuesExtractorBundle } from './extractor/types';
export declare const compileJSONPathSchema: <S extends PluginScalarParam, A extends PluginArrayParamType>(path: PluginValuesPathSchema<S, A>, factoryFn: (path: string) => JSONPathReader) => PluginValuesExtractorBundle<S, A>;
