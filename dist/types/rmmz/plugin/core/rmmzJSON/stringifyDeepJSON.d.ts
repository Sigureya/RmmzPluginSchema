export type DeepJSONValue = string | number | boolean | null | DeepJSONValue[] | {
    [key: string]: DeepJSONValue;
};
export declare const stringifyDeepRecord: <T extends object>(obj: T) => Record<keyof T, string>;
export declare const stringifyDeepJSON: (obj: unknown) => string;
