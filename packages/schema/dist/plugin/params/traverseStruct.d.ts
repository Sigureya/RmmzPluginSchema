import { AnnotationPrimitiveTypes } from './types/';
import { StructBase2, StructComplete, StructWithParams } from './types/struct2';
export declare const maxDepth: (obj: AnnotationPrimitiveTypes | StructWithParams) => number;
export declare const flatStructs: (annotation: AnnotationPrimitiveTypes | Omit<StructComplete, "default">) => Set<StructBase2>;
export declare const traverseStruct: <Result, Ant extends AnnotationPrimitiveTypes | StructWithParams>(obj: Ant, callback: (structName: Ant, acc: Result, depth: number) => Result, initialValue: Result) => Result;
