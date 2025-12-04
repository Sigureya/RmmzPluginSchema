import type {
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
  StructRefParam,
  StructArrayRefParam,
  ClassifiedPluginParamsEx2,
  ArrayParamItemType2,
  PluginParamEx2,
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
import type {
  PluginValuesPathSchema,
  PrimitivePluginValuesPath,
} from "./types";

export const createPluginValuesPath = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx2<S, A>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathSchema<S, A> => {
  if (isStructAttr(param)) {
    return createStructPath(category, param, structMap);
  }
  if (isStructArrayAttr(param)) {
    return createStructArrayPath(category, param, structMap);
  }
  if (isArrayAttr(param)) {
    return createPrimitiveArrayPath<S, A>(category, rootName, param);
  }
  return createPrimiteveParamPath<S>(
    category,
    rootName,
    param as PluginParamEx<S>
  ) satisfies PrimitivePluginValuesPath<S>;
};

const createPrimitiveArrayPath = <
  S extends PluginScalarParam,
  T extends ArrayParamItemType2
>(
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx<T>
): PluginValuesPathSchema<S, T> => {
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

export const createPrimiteveParamPath = <T extends PluginScalarParam>(
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
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathSchema<S, A> => {
  return createStructPath(category, param, structMap);
};

const createStructPath = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathSchema<S, A> => {
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
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  category: "param" | "args",
  param: PluginParamEx<StructArrayRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>
): PluginValuesPathSchema<S, A> => {
  return {
    structArrays: getPathFromStructArraySchema(param, "$", structMap),
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structs: { items: [], errors: [] },
  };
};
