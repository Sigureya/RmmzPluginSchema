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
  PluginValuesPathNewVersion,
  PrimitivePluginValuesPath,
} from "./types";

export const createPluginValuesPathPP2 = (
  category: "param" | "args",
  rootName: string,
  param: PluginParam,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathNewVersion => {
  if (isStructAttr(param)) {
    return sss(category, param, structMap);
  }
  if (isStructArrayAttr(param)) {
    return aaaa(category, param, structMap);
  }
  if (isArrayAttr(param)) {
    return att(category, rootName, param);
  }
  return createPrimiteveParamPath(
    category,
    rootName,
    param as PluginParamEx<ScalarParam>
  );
};

const att = (
  category: "param" | "args",
  rootName: string,
  param: PluginParamEx<Exclude<ArrayParamTypes, StructArrayRefParam>>
): PluginValuesPathNewVersion => {
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

export const createPluginValuesPathPP = (
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathNewVersion => {
  return sss(category, param, structMap);
};

const sss = (
  category: "param" | "args",
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
) => {
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

const aaaa = (
  category: "param" | "args",
  param: PluginParamEx<StructArrayRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathNewVersion => {
  return {
    structArrays: getPathFromStructArraySchema([param], "$", structMap),
    rootName: param.name,
    rootCategory: category,
    scalars: undefined,
    structs: { items: [], errors: [] },
  };
};
