import { KeywordEnum } from './keyword/types';
import { PluginDependencies } from './pluginDependencies';
import { PluginMeta } from './pluginMeta';
import { OptionItem } from './selectOption';
export interface PluginParamTokens {
    name: string;
    attr: PluginTokensRecord;
    options?: OptionItem[];
}
export type PluginTokensRecord = {
    [key in KeywordEnum]?: string;
};
export interface PluginCommandTokens {
    command: string;
    text?: string;
    desc?: string;
    args: PluginParamTokens[];
}
export interface PluginStructTokens {
    name: string;
    params: PluginParamTokens[];
}
export interface PluginTokens {
    params: PluginParamTokens[];
    commands: PluginCommandTokens[];
    structs: PluginStructTokens[];
}
export interface ParsedPlugin extends PluginTokens {
    locale?: string;
    meta: Partial<PluginMeta>;
    params: PluginParamTokens[];
    commands: PluginCommandTokens[];
    helpLines: string[];
    dependencies: PluginDependencies;
    structs: PluginStructTokens[];
}
