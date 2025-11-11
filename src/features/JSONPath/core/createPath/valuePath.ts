import type { ClassifiedPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesPath, ValueCategory } from "./pathSchemaTypes";
import { makeScalarValuesPath, makeScalarArrayPath } from "./scalarValue";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "./structValue";

export const createPluginValuesPath = (
  category: ValueCategory,
  rootName: string,
  cpp: ClassifiedPluginParams,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPath => {
  const parent: string = "$";

  return {
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
      name: rootName,
      objectSchema: toObjectPluginParams(cpp.scalars),
      // ex: root.param
      scalars: makeScalarValuesPath(cpp.scalars, parent),
      // ex: root.array[*]
      scalarArrays: makeScalarArrayPath(cpp.scalarArrays, parent),
    },
  };
};
