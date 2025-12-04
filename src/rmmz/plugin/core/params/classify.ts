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
} from "./types";
import {
  isStructParam,
  isStructArrayAttr,
  isArrayAttr,
  hasTextAttr,
} from "./typeTest";

export function classifyPluginParams(
  params: ReadonlyArray<PluginParam>
): ClassifiedPluginParams;

export function classifyPluginParams<
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(params: ReadonlyArray<PluginParamEx2<S, A>>): ClassifiedPluginParamsEx2<S, A>;

export function classifyPluginParams(
  params: ReadonlyArray<PluginParam>
): ClassifiedPluginParams {
  return classifyPluginParamsCore(
    params,
    (p): p is PluginParamEx<PluginScalarParam> => true,
    (p): p is PluginParamEx<PluginArrayParamType> => true
  );
}

export const classifyFileParams = (
  params: ReadonlyArray<PluginParam>
): ClassifiedPluginFileParams => {
  return classifyPluginParamsCore(
    params,
    (p): p is PluginParamEx<FileParam> => p.attr.kind === "file",
    (p): p is PluginParamEx<FileArrayParam> => p.attr.kind === "file[]"
  );
};

export const classifyTextParams = (
  params: ReadonlyArray<PluginParam>
): ClassifiedTextParams => {
  return classifyPluginParamsCore(
    params,
    (p): p is PluginParamEx<PrimitiveStringParam> => hasTextAttr(p),
    (p) => hasTextAttr(p)
  );
};

const classifyPluginParamsCore = <
  T extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  paramArray: ReadonlyArray<PluginParam>,
  predicate: (param: PluginParam) => param is PluginParamEx<T>,
  arrayPredicate: (
    param: PluginParamEx<PluginArrayParamType>
  ) => param is PluginParamEx<A>
): ClassifiedPluginParamsEx2<T, A> => {
  const structs: PluginParamEx<StructRefParam>[] = [];
  const structArrays: PluginParamEx<StructArrayRefParam>[] = [];
  const scalas: PluginParamEx<T>[] = [];
  const scalaArrays: PluginParamEx<A>[] = [];
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
