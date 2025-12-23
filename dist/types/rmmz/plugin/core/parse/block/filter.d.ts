import { PluginBodyBlock, PluginStructBlock } from './types';
export declare const findPluginBodyByLocale: (bodies: ReadonlyArray<PluginBodyBlock>, locale: string) => PluginBodyBlock | undefined;
export declare const filterSturctByLocale: (structs: ReadonlyArray<PluginStructBlock>, locale: string) => PluginStructBlock[];
