import { JSONPathReader } from '../../../libs/jsonPath';
import { ClassifiedPluginParams, PluginCommandSchemaArray } from '../../../rmmz/plugin';
import { CommandBuildErrorHandlers } from './createPath/types/handlers';
import { CommandArgExtractors } from './extractor/types';
import { ErrorStruct } from './extractor/types/error';
export declare const buildSingleCommand: (pluginName: string, schema: PluginCommandSchemaArray, structMap: ReadonlyMap<string, ClassifiedPluginParams>, factoryFn: (path: string) => JSONPathReader, handlers: CommandBuildErrorHandlers<ErrorStruct>) => {
    extractor: CommandArgExtractors;
    errors: ErrorStruct[];
};
