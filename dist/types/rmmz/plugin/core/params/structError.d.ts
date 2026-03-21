import { PrimitiveParam, StructArrayRefParam, StructRefParam } from './types';
export declare const isErrorStructParam: (param: PrimitiveParam) => param is StructRefParam | StructArrayRefParam;
