import {
  toObjectPluginParams,
  type ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "../paramStruct";
import { makeScalarParams, makeScalarArrayParams } from "./paramScalar";
import type { CommandPath, StructPropertysPath } from "./types/pathSchemaTypes";

export const vv = (
  rootName: string,
  cpp: ClassifiedPluginParams,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): CommandPath => {
  const parent: string = "$";

  const structArgsPath = getPathFromStructParam(cpp.structs, parent, structMap);
  const structArrayArgsPath = getPathFromStructArraySchema(
    cpp.structArrays,
    parent,
    structMap
  );

  const path: StructPropertysPath = {
    objectSchema: toObjectPluginParams(cpp.scalars),
    structName: rootName,
    scalars: makeScalarParams(cpp.scalars, parent),
    scalarArrays: makeScalarArrayParams(cpp.scalarArrays, parent),
  };

  return {
    scalars: path,
    structs: structArgsPath,
    structArrays: structArrayArgsPath,
  };
};
