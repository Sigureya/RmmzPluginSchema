import { PluginScalarParam, PluginArrayParamType, PluginParam, PluginParamsRecord } from '../../../rmmz/plugin';
import { PluginSchemaOf } from '../../../rmmz/plugin/core/pluginJSON2type';
import { CommandExtractorEntry, PluginValues, PluginValuesExtractorBundle } from './extractor/types';
export interface PluginExtractorBundle {
    pluginName: string;
    params: PluginValuesExtractorBundle[];
    commands: CommandExtractorEntry[];
}
export interface CommandExtractorEntryList {
    extractorEntries: CommandExtractorEntry[];
}
export interface ConvertPluginResult<S extends PluginScalarParam, A extends PluginArrayParamType> extends CommandExtractorEntryList {
    params: PluginValues<PluginParam>[];
    record: PluginParamsRecord;
    schema: PluginSchemaOf<S, A>;
    extractorEntries: CommandExtractorEntry[];
}
