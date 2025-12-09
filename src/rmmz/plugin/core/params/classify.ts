/* eslint-disable @functional/no-return-void */

import type {
  PluginParamEx,
  StructRefParam,
  StructArrayRefParam,
  PluginScalarParam,
  PluginArrayParamType,
  PluginParam,
  FileParam,
  FileArrayParam,
  PrimitiveStringParam,
  ClassifiedPluginFileParams,
  ClassifiedTextParams,
  ClassifiedPluginParamsEx2,
  PluginParamEx2,
  ClassifiedPluginParams,
  NumberArrayParam,
  ClassifiedPluginParamsEx7,
  PluginParamEx3,
  StringArrayUnion,
  NumberArrayUnion,
  StringArrayParam,
} from "./types";
import {
  isStructParam,
  isStructArrayAttr,
  isArrayAttr,
  hasTextAttr,
} from "./typeTest";

export function classifyPluginParams<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayUnion
>(
  params: ReadonlyArray<PluginParamEx3<S, NA, SA>>
): ClassifiedPluginParamsEx7<S, NA, SA>;

export function classifyPluginParams<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(params: ReadonlyArray<PluginParamEx2<S, A>>): ClassifiedPluginParamsEx2<S, A>;

export function classifyPluginParams(
  params: ReadonlyArray<PluginParam>
): ClassifiedPluginParams;

export function classifyPluginParams(
  params: ReadonlyArray<PluginParam>
): ClassifiedPluginParams {
  type AT = PluginParamEx<NumberArrayUnion> | PluginParamEx<StringArrayUnion>;
  return classifyPluginParamsCore(
    params,
    (p): p is PluginParamEx<PluginScalarParam> => true,
    (p): p is AT => true
  );
}

export const classifyFileParams = (
  params: ReadonlyArray<PluginParam>
): ClassifiedPluginFileParams => {
  return classifyPluginParamsCore(
    params,
    (p): p is PluginParamEx<FileParam> => p.attr.kind === "file",
    (p): p is PluginParamEx<FileArrayParam> => p.attr.kind === "file[]"
  ) as ClassifiedPluginFileParams;
};

export const classifyTextParams = (
  params: ReadonlyArray<PluginParam>
): ClassifiedTextParams => {
  return classifyPluginParamsCore(
    params,
    (p): p is PluginParamEx<PrimitiveStringParam> => hasTextAttr(p),
    (p) => hasTextAttr(p)
  ) as ClassifiedTextParams;
};

const classifyPluginParamsCore = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  paramArray: ReadonlyArray<PluginParam>,
  predicate: (param: PluginParam) => param is PluginParamEx<S>,
  arrayPredicate: (
    param: PluginParamEx<PluginArrayParamType>
  ) => param is PluginParamEx<NA> | PluginParamEx<SA>
): ClassifiedPluginParamsEx7<S, NA, SA> => {
  const structs: PluginParamEx<StructRefParam>[] = [];
  const structArrays: PluginParamEx<StructArrayRefParam>[] = [];
  const scalas: PluginParamEx<S>[] = [];
  const scalaArrays: (PluginParamEx<NA> | PluginParamEx<SA>)[] = [];
  paramArray.forEach((p) => {
    if (isStructParam(p.attr)) {
      structs.push({ name: p.name, attr: p.attr });
      return;
    }
    if (isStructArrayAttr(p)) {
      structArrays.push(p);
      return;
    }
    if (isArrayAttr(p)) {
      if (arrayPredicate(p)) {
        scalaArrays.push(p);
        return;
      }
    } else {
      if (predicate(p)) {
        scalas.push(p);
      }
    }
  });
  return { structs, structArrays, scalars: scalas, scalarArrays: scalaArrays };
};
