import { PrimitiveParam } from '../../rmmz/plugin';
import { KeyWord } from './types';
export declare const createKeywordLine: <K extends string>(keyword: K, value: string) => KeyWord<K>;
export declare const createKeywordLineEx: <T>(data: T, key: Extract<keyof T, string>) => KeyWord<Extract<typeof key, string>> | undefined;
export declare const createKindLine: (data: PrimitiveParam) => KeyWord<"type">;
