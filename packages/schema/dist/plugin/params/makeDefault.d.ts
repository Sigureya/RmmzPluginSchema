import { BaseStruct } from './types/struct2';
import type * as Types from "./types/";
export declare const makeDefaultValue: (annotation: Types.AnnotationTypes, dic?: Types.Dictionary) => string;
export declare const makeDefaultStruct: <T extends object>(annotation: BaseStruct<T>) => T;
