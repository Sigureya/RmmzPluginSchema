import { AnnotationPrimitiveTypes } from './types';
import { AnnotationMapper } from './types/mapper';
import { StructComplete } from './types/struct2';
export declare const mapping: <T>(annotation: AnnotationPrimitiveTypes | StructComplete, mapper: AnnotationMapper<T>) => T;
