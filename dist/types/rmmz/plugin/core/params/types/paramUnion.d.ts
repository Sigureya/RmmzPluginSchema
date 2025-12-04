import { StructDefParam, StructArrayDefParam } from './objectSturctDef';
import { StringParam, AnyStringParam, ComboParam, SelectParam, BooleanParam, NumberParam, NumberArrayParam, StringArrayParam, RpgVariableParam, RpgVariableArrayParam, RpgSwitchParam, RpgSwitchArrayParam, FileParam, FileArrayParam, StructRefParam, StructArrayRefParam, ArrayParam, KindOfStructBase } from './primitive';
import { SystemDataIdParam, SystemDataIdArrayParam, RpgDataIdParam, RpgDataIdArrayParam } from './rpgDataTypes';
export type PrimitiveStringParam = StringParam | AnyStringParam | ComboParam | SelectParam;
export type PrimitiveTextParam = StringParam | StringArrayParam;
export type PrimitiveParam = BooleanParam | NumberParam | NumberArrayParam | RpgDataIdParam | RpgDataIdArrayParam | ComboParam | SelectParam | StringParam | StringArrayParam | SystemDataIdParam | SystemDataIdArrayParam | RpgVariableParam | RpgVariableArrayParam | RpgSwitchParam | RpgSwitchArrayParam | FileParam | FileArrayParam | StructRefParam | StructArrayRefParam | AnyStringParam;
export type ParamKinds = Exclude<PrimitiveParam, ArrayParam | StructArrayRefParam>["kind"];
export type PluginScalarParam = Exclude<PrimitiveParam, ArrayParam | StructArrayRefParam | KindOfStructBase>;
/**
 * @deprecated use PluginScalarParam instead
 */
export type ScalarParam = PluginScalarParam;
export type PluginArrayParamType = Extract<PrimitiveParam, ArrayParam>;
/**
 * @deprecated use PluginArrayParamType instead
 */
export type ArrayParamTypes = PluginArrayParamType;
export type ArrayParamItemType2 = Exclude<PluginArrayParamType, {
    default: object[];
}>;
export type StructParam = PrimitiveParam | StructDefParam<object> | StructArrayDefParam<object>;
