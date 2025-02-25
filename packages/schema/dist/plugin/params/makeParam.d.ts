import { AnnotationPrimitiveTypes, Dictionary, ParamTexts } from './types';
import { StructComplete } from './types/struct2';
export declare const uniqueAnnotations: (ant: AnnotationPrimitiveTypes | StructComplete, dic?: Dictionary) => `@${string} ${string}`[];
export declare const makeParam: (name: string, ant: AnnotationPrimitiveTypes | StructComplete, mode?: "@param" | "@arg", dic?: Dictionary) => ParamTexts;
export declare const joinAnntations: (paramTexts: ParamTexts) => string[];
