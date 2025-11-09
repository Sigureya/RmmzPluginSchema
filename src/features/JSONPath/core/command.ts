import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  classifyPluginParams,
  toObjectPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { makeScalaArrayParams, makeScalaParams } from "./paramScala";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "./paramStruct";
import type { StructPathResult, StructPropertysPath } from "./types";
import type { CommandPath } from "./types/command";

export const cccc2 = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): StructPathResult => {
  const rrrr: CommandPath = createCommandArgsPath(schema, structMap);
  return {
    items: [rrrr.scalars, ...rrrr.structs.items, ...rrrr.structArrays.items],
    errors: [...rrrr.structs.errors, ...rrrr.structArrays.errors],
  };
};

export const createCommandArgsPath = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): CommandPath => {
  const cpp = classifyPluginParams(schema.args);
  const parent: string = "$";

  const structArgsPath = getPathFromStructParam(cpp.structs, parent, structMap);
  const structArrayArgsPath = getPathFromStructArraySchema(
    cpp.structArrays,
    parent,
    structMap
  );

  const p: StructPropertysPath = {
    objectSchema: toObjectPluginParams(cpp.scalas),
    structName: schema.command,
    scalas: makeScalaParams(cpp.scalas, parent),
    scalaArrays: makeScalaArrayParams(cpp.scalaArrays, parent),
  };

  return {
    scalars: p,
    structs: structArgsPath,
    structArrays: structArrayArgsPath,
  };
};
