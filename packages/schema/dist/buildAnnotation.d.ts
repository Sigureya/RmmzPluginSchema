import type { Struct } from './plugin';
export declare const buildAnnotation: <T extends object>(s: Struct<T>[]) => string;
export declare const correctErros: (s: Struct<object>[]) => never[];
