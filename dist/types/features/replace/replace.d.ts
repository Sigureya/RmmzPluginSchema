import { JSONValue } from '../../libs/jsonPath';
export declare const replacePluginValue: (params: Record<string, JSONValue>, paths: readonly (readonly string[])[], replace: (value: string) => string | undefined) => Record<string, JSONValue>;
