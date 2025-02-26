import { StructAnnotation } from './plugin';
export declare const buildAnnotation: <T extends object>(s: StructAnnotation<T>[]) => string;
export declare const correctErros: (s: StructAnnotation<object>[]) => never[];
