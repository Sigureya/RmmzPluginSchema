import { AnnotationTypes, ParamTexts } from './types';
export declare const uniqueAnnotations: (ant: AnnotationTypes, dic: Record<string, string>) => `@${string} ${string}`[];
export declare const makeParam: (name: string, ant: AnnotationTypes, mode?: "@param" | "@arg", dic?: Record<string, string>) => ParamTexts;
