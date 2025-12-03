import type { PluginParamEx } from "./arrayParamItems";
import type {
  ScalarParam,
  ArrayParamTypes,
  PrimitiveParam,
} from "./paramUnion";
import type { PluginStructParamTypeEx } from "./pluginSchemaType";
import type { StructRefParam, StructArrayRefParam } from "./primitive";

export interface ScalaStruct {
  scalars: PluginParamEx<ScalarParam>[];
  scalarArrays: PluginParamEx<ArrayParamTypes>[];
}

export interface ClassifiedPluginParams extends ScalaStruct {
  structs: PluginParamEx<StructRefParam>[];
  structArrays: PluginParamEx<StructArrayRefParam>[];
  scalars: PluginParamEx<ScalarParam>[];
  scalarArrays: PluginParamEx<ArrayParamTypes>[];
}

export interface ClassifiedPluginParamsEx2<
  S extends ScalarParam,
  A extends ArrayParamTypes
> extends ScalaStruct {
  structs: PluginParamEx<StructRefParam>[];
  structArrays: PluginParamEx<StructArrayRefParam>[];
  scalars: PluginParamEx<S>[];
  scalarArrays: PluginParamEx<A>[];
}

export type ParamTypesEx4<T, Attr extends PrimitiveParam> = Extract<
  PluginStructParamTypeEx<T>,
  { attr: Attr; name: string }
>;

export interface ClassifiedPluginParamsEx<T> extends ClassifiedPluginParams {
  structs: ParamTypesEx4<T, StructRefParam>[];
  structArrays: ParamTypesEx4<T, StructArrayRefParam>[];
  scalars: ParamTypesEx4<T, ScalarParam>[];
  scalarArrays: ParamTypesEx4<T, ArrayParamTypes>[];
}
