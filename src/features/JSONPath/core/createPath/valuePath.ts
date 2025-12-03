import type {
  ArrayParamTypes,
  PluginParamEx,
  ScalarParam,
  StructRefParam,
  StructArrayRefParam,
  PluginParam,
  ClassifiedPluginParamsEx2,
  ArrayParamItemType2,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  isArrayAttr,
  isStructArrayAttr,
  isStructAttr,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  getPathFromStructArraySchema,
  getPathFromStructParam,
} from "./structValue";
import type { PluginValuesPathEx, PrimitivePluginValuesPath } from "./types";

export const createPluginValuesPath = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  category: "param" | "args",
  rootName: string,
  param: PluginParam,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
):
  | PluginValuesPathEx<S, A>
  | PrimitivePluginValuesPath<S>
  | PluginValuesPathEx<ScalarParam, ArrayParamItemType2> => {
  if (isStructAttr(param)) {
    return createStructPath(
      category,
      param,
      structMap
    ) satisfies PluginValuesPathEx<S, A>;
  }
  if (isStructArrayAttr(param)) {
    return createStructArrayPath(
      category,
      param,
      structMap
    ) satisfies PluginValuesPathEx<S, A>;
  }
  if (isArrayAttr(param)) {
    return createPrimitiveArrayPath(
      category,
      rootName,
      param
    ) satisfies PluginValuesPathEx<ScalarParam, ArrayParamItemType2>;
  }
  return createPrimiteveParamPath<ScalarParam>(
    category,
    rootName,
    param as PluginParamEx<ScalarParam>
  ) satisfies PrimitivePluginValuesPath<ScalarParam>;
};

const createPrimitiveArrayPath = <T extends ArrayParamItemType2>(
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx<Exclude<T, StructArrayRefParam>>
): PluginValuesPathEx<ScalarParam, T> => {
  return {
    rootCategory: category,
    rootName: rootName,
    scalars: {
      category,
      name: "array",
      objectSchema: {},
      scalarsPath: undefined,
      scalarArrays: [
        {
          path: `$.${param.name}[*]`,
          param,
        },
      ],
    },
    structs: { items: [], errors: [] },
    structArrays: { items: [], errors: [] },
  };
};

export const createPrimiteveParamPath = <T extends ScalarParam>(
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx<T>
): PrimitivePluginValuesPath<T> => {
  return {
    rootCategory: category,
    rootName: rootName,
    scalars: {
      category: "primitive",
      name: param.attr.kind,
      objectSchema: {
        [param.name]: param.attr,
      },
      scalarsPath: `$.${param.name}`,
      scalarArrays: [],
    },
    structArrays: { items: [], errors: [] },
    structs: { items: [], errors: [] },
  };
};

export const createStructParamPath = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathEx<S, A> => {
  return createStructPath(category, param, structMap);
};

const createStructPath = <S extends ScalarParam, A extends ArrayParamTypes>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathEx<S, A> => {
  return {
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structArrays: {
      items: [],
      errors: [],
    },
    structs: getPathFromStructParam(param, "$", structMap),
  };
};

const createStructArrayPath = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  category: "param" | "args",
  param: PluginParamEx<StructArrayRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathEx<S, A> => {
  return {
    structArrays: getPathFromStructArraySchema(param, "$", structMap),
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structs: { items: [], errors: [] },
  };
};
