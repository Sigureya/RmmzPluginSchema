import { JSONValue } from '../../../../libs/jsonPath';
import { PluginScalarParam, PluginArrayParamType } from '../../../../rmmz/plugin';
import { PluginValuesExtractorBundle, PluginValues } from './types';
export declare const extractAllPluginValues: <S extends PluginScalarParam, A extends PluginArrayParamType>(value: Record<string, JSONValue>, memo: ReadonlyArray<PluginValuesExtractorBundle<S, A>>) => PluginValues[];
