import { AnnotationTypes } from './types';
import { AnnotationMapper } from './types/mapper';
export declare const mapping: <T>(annotation: AnnotationTypes, mapper: AnnotationMapper<T>) => T;
