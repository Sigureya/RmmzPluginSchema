import type {
  ArrayParamTypes,
  ClassifiedPluginParams,
  PluginParamEx,
  ScalarParam,
  StructRefParam,
  StructArrayRefParam,
  PluginParam,
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
  PluginValuesPath,
  PluginValuesPathBase,
  PrimitivePluginValuesPath,
} from "./types";

export const createPluginValuesPath = (
  category: "param" | "args",
  rootName: string,
  param: PluginParam,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathBase => {
  if (isStructAttr(param)) {
    return createStructPath(category, param, structMap);
  }
  if (isStructArrayAttr(param)) {
    return createStructArrayPath(category, param, structMap);
  }
  if (isArrayAttr(param)) {
    return createPrimitiveArrayPath(category, rootName, param);
  }
  return createPrimiteveParamPath(
    category,
    rootName,
    param as PluginParamEx<ScalarParam>
  );
};

const createPrimitiveArrayPath = (
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx<Exclude<ArrayParamTypes, StructArrayRefParam>>
): PluginValuesPath => {
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

export const createPrimiteveParamPath = (
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx<ScalarParam>
): PrimitivePluginValuesPath => {
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

export const createStructParamPath = (
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathBase => {
  return createStructPath(category, param, structMap);
};

const createStructPath = (
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPath => {
  return {
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structArrays: {
      items: [],
      errors: [],
    },
    structs: getPathFromStructParam([param], "$", structMap),
  };
};

const createStructArrayPath = (
  category: "param" | "args",
  param: PluginParamEx<StructArrayRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPath => {
  return {
    structArrays: getPathFromStructArraySchema([param], "$", structMap),
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structs: { items: [], errors: [] },
  };
};
