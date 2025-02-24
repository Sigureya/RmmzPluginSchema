import type { AnnotationTypes, ParamTexts } from './types';
export declare const uniqueAnnotations: (ant: AnnotationTypes) => `@${string} ${string}`[];
export declare const makeParam: (name: string, ant: AnnotationTypes, mode?: "@param" | "@arg") => ParamTexts;
