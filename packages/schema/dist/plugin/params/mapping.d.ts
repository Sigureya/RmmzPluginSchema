import type { AnnotationTypes } from './types';
import type { AnnotationMapper } from './types/mapper';
export declare const mapping: <T>(annotation: AnnotationTypes, mapper: AnnotationMapper<T>) => T;
