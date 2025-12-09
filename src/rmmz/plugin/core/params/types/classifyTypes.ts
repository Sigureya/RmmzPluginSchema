import type { PluginParamEx } from "./arrayParamItems";
import type {
  PluginScalarParam,
  PluginArrayParamType,
  PrimitiveParam,
  StringArrayUnion,
  NumberArrayUnion,
} from "./paramUnion";
import type { PluginStructParamTypeEx } from "./pluginSchemaType";
import type {
  StructRefParam,
  StructArrayRefParam,
  FileArrayParam,
} from "./primitive";

export interface ScalaStruct {
  scalars: PluginParamEx<PluginScalarParam>[];
  scalarArrays: (
    | PluginParamEx<NumberArrayUnion>
    | PluginParamEx<StringArrayUnion>
  )[];
}

export interface ClassifiedPluginParams {
  structs: PluginParamEx<StructRefParam>[];
  structArrays: PluginParamEx<StructArrayRefParam>[];
  scalars: PluginParamEx<PluginScalarParam>[];
  scalarArrays: (
    | PluginParamEx<NumberArrayUnion>
    | PluginParamEx<StringArrayUnion>
    | PluginParamEx<FileArrayParam>
  )[];
}

export interface ClassifiedPluginParamsEx2<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
> {
  structs: PluginParamEx<StructRefParam>[];
  structArrays: PluginParamEx<StructArrayRefParam>[];
  scalars: PluginParamEx<S>[];
  scalarArrays: PluginParamEx<A>[];
}

export interface ClassifiedPluginParamsEx7<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> extends ClassifiedPluginParams {
  structs: PluginParamEx<StructRefParam>[];
  structArrays: PluginParamEx<StructArrayRefParam>[];
  scalars: PluginParamEx<S>[];
  scalarArrays: (PluginParamEx<NA> | PluginParamEx<SA>)[];
}

type ParamTypesEx4<T, Attr extends PrimitiveParam> = Extract<
  PluginStructParamTypeEx<T>,
  { attr: Attr; name: string }
>;

export type ClassifiedPluginParamsEx<
  T,
  S extends PluginScalarParam = PluginScalarParam,
  A extends PluginArrayParamType = PluginArrayParamType
> = ClassifiedPluginParamsEx2<S, A> & {
  structs: ParamTypesEx4<T, StructRefParam>[];
  structArrays: ParamTypesEx4<T, StructArrayRefParam>[];
  scalars: ParamTypesEx4<T, PluginScalarParam>[];
  scalarArrays: ParamTypesEx4<T, PluginArrayParamType>[];
};
