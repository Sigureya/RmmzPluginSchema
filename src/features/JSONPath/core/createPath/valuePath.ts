import type {
  ClassifiedPluginParams,
  PluginParamEx,
  ScalarParam,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { getPathFromStructParam } from "./structValue";
import type {
  PluginValuesPathNewVersion,
  PrimitivePluginValuesPath,
  ValueCategory,
} from "./types/pathSchemaTypes";

export const eee = (
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
  category: ValueCategory,
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathNewVersion => {
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
