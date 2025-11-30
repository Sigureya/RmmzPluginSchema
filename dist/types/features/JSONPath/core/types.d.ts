import { ExtractorBundle, CommandExtractorEntry } from './extractor/types';
export interface PluginExtractorBundle {
    params: ExtractorBundle[];
    commands: CommandExtractorEntry[];
}
