import type {
  ClassifiedPluginParams,
  PluginParamEx,
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
  ValueCategory,
} from "./types/pathSchemaTypes";

export const createPluginValuesPathPP = (
  category: ValueCategory,
  param: PluginParamEx<StructRefParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathNewVersion => {
  const parent: string = "$";
  const cpp = classifyFileParams([param]);

  return {
    name: param.attr.struct,
    category: category,
    // ex: root.struct.param
    structs: getPathFromStructParam(cpp.structs, parent, structMap),
    // ex: root.array[*].param
    structArrays: getPathFromStructArraySchema(
      cpp.structArrays,
      parent,
      structMap
    ),
    scalars: {
      category: category,
      name: param.attr.struct,
      objectSchema: toObjectPluginParams(cpp.scalars),
      // ex: root.param
      scalars: makeScalarValuesPath(cpp.scalars, parent),
      // ex: root.array[*]
      scalarArrays: makeScalarArrayPath(cpp.scalarArrays, parent),
    },
  };
};
