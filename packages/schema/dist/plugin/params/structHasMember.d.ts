import { StructAnnotation_Union, StructAnnotation_WithName, StructAnnotation_WithParams, StructAnnotation_WithDefault, AnnotationTypes, HasStruct } from './types';
export declare const hasStruct: (annotation: AnnotationTypes) => annotation is Extract<AnnotationTypes, HasStruct>;
export declare const hasStructParams: <T extends object>(annotation: StructAnnotation_Union<T>) => annotation is StructAnnotation_WithParams<T>;
export declare const hasStructDefault: <T extends object>(annotation: StructAnnotation_Union<T>) => annotation is StructAnnotation_WithDefault<T>;
export declare const hasStructName: <T extends object>(annotation: StructAnnotation_Union<T>) => annotation is StructAnnotation_WithName<T>;
