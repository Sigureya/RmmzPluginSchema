import { AnnotationBase } from './annotationBase';
import { BooleanArg } from './boolean';
export type GGG<T extends Omit<AnnotationBase, "default">, ValueType = string> = {
    [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T];
export type XX = GGG<Required<BooleanArg>>;
