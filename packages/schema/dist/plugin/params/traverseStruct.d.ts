import type { AnnotationTypes, StructBase } from './types/';
export declare const maxDepth: (obj: AnnotationTypes) => number;
export declare const flatStructs: (annotation: AnnotationTypes) => Set<StructBase>;
export declare const traverseStruct: <Result>(obj: AnnotationTypes, callback: (structName: AnnotationTypes, acc: Result, depth: number) => Result, initialValue: Result) => Result;
