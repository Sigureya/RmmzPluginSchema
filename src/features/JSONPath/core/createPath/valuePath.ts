import type {
  PluginParamEx,
  PluginScalarParam,
  StructRefParam,
  StructArrayRefParam,
  ArrayParamItemType2,
  NumberArrayParam,
  ClassifiedPluginParamsEx7,
  ClassifiedPluginParams,
  StringArrayUnion,
  NumberArrayUnion,
  PluginParamEx3,
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
  PluginValuesPathOld,
  PluginValuesPathSchema,
  PluginValuesPathSchema7,
  PrimitivePluginValuesPath,
} from "./types";

export function createPluginValuesPath<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx3<S, NA, SA>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>
): PluginValuesPathSchema7<S, NA, SA> {
  if (isStructAttr(param)) {
    return createStructPath(category, param, structMap);
  }
  if (isStructArrayAttr(param)) {
    return createStructArrayPath(category, param, structMap);
  }
  if (isArrayAttr(param)) {
    return createPrimitiveArrayPath<S, NA | SA>(category, rootName, param);
  }
  return createPrimiteveParamPath<S>(
    category,
    rootName,
    param as PluginParamEx<S>
  ) satisfies PrimitivePluginValuesPath<S>;
}

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

export function createStructParamPath<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayUnion
>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>
): PluginValuesPathSchema7<S, NA, SA>;

export function createStructParamPath(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathOld;

export function createStructParamPath<
  S extends PluginScalarParam,
  NA extends NumberArrayParam,
  SA extends StringArrayUnion
>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>
): PluginValuesPathSchema7<S, NA, SA> {
  return createStructPath(category, param, structMap);
}

const createStructPath = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>
): PluginValuesPathSchema7<S, NA, SA> => {
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
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  category: "param" | "args",
  param: PluginParamEx<StructArrayRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>
): PluginValuesPathSchema7<S, NA, SA> => {
  return {
    structArrays: getPathFromStructArraySchema(param, "$", structMap),
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structs: { items: [], errors: [] },
  };
};
