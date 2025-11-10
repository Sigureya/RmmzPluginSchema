import type { ClassifiedPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { makeScalarParams, makeScalarArrayParams } from "./paramScalar";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "./structValue";
import type { CommandPath, ValueCategory } from "./types/pathSchemaTypes";

export const createPluginValuesPath = (
  category: ValueCategory,
  rootName: string,
  cpp: ClassifiedPluginParams,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): CommandPath => {
  const parent: string = "$";
  return {
    structs: getPathFromStructParam(cpp.structs, parent, structMap),
    structArrays: getPathFromStructArraySchema(
      cpp.structArrays,
      parent,
      structMap
    ),
    scalars: {
      category: category,
      objectSchema: toObjectPluginParams(cpp.scalars),
      structName: rootName,
      scalars: makeScalarParams(cpp.scalars, parent),
      scalarArrays: makeScalarArrayParams(cpp.scalarArrays, parent),
    },
  };
};
