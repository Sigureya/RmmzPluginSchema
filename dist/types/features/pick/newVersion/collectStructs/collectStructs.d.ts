import { PluginStructSchemaArray, ParamKinds } from '../../../../rmmz/plugin';
import { StructCollection } from './types';
export declare const collectStructsByKinds: (structs: ReadonlyArray<PluginStructSchemaArray>, kinds: ReadonlyArray<ParamKinds>) => StructCollection;
