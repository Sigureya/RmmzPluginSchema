import { ScalarParam, PluginParam } from '../../rmmz/plugin';
import { PluginParamGroups } from './newVersion/filter/types';
export declare const filterParams: <Fn extends (param: ScalarParam, name: string) => boolean>(params2: ReadonlyArray<PluginParam>, set: Pick<ReadonlySet<string>, "has">, fn: Fn) => PluginParamGroups;
