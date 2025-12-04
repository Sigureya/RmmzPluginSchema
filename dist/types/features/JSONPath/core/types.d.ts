import { CommandExtractorEntry, PluginValuesExtractorBundle } from './extractor/types';
export interface PluginExtractorBundle {
    pluginName: string;
    params: PluginValuesExtractorBundle[];
    commands: CommandExtractorEntry[];
}
