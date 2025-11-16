import type {
  ClassifiedPluginParams,
  PluginParamEx,
  ScalarParam,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  classifyFileParams,
  toObjectPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { makeScalarValuesPath, makeScalarArrayPath } from "./scalarValue";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "./structValue";
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
  const parent: string = "$";
  const cpp = classifyFileParams([param]);

  return {
    rootName: param.name,
    rootCategory: category,
    // ex: root.struct.param
    structs: getPathFromStructParam(cpp.structs, parent, structMap),
    // ex: root.array[*].param
    structArrays: getPathFromStructArraySchema(
      cpp.structArrays,
      parent,
      structMap
    ),
    scalars: {
      category: "struct",
      name: param.attr.struct,
      objectSchema: toObjectPluginParams(cpp.scalars),
      // ex: root.param
      scalarsPath: makeScalarValuesPath(cpp.scalars, parent),
      // ex: root.array[*]
      scalarArrays: makeScalarArrayPath(cpp.scalarArrays, parent),
    },
  };
};
