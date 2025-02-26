import type * as Types from "./types/";
export declare const makeDefaultValue: (annotation: Types.AnnotationPrimitiveTypes | Types.StructAnnotation_Union<object>, dic?: Types.Dictionary) => string;
export declare const makeDefaultStruct: <T extends object>(annotation: Types.StructAnnotation_Union<T>) => T;
