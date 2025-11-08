import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  classifyPluginParams,
  toObjectPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { makeScalaArrayParams, makeScalaParams } from "./paramScala";
import { getPathFromStructParam } from "./paramStruct";
import type { StructPropertysPath } from "./types";

const ccc = (
  schema: PluginCommandSchemaArray,
  structs: ReadonlyMap<string, ClassifiedPluginParams>,
  parent: string = "$"
) => {
  const cpp = classifyPluginParams(schema.args);

  const structArgsPath = getPathFromStructParam(cpp.structs, parent, structs);

  const p: StructPropertysPath = {
    objectSchema: toObjectPluginParams(cpp.scalas),
    structName: schema.command,
    scalas: makeScalaParams(cpp.scalas, parent),
    scalaArrays: makeScalaArrayParams(cpp.scalaArrays, parent),
  };
  return {
    p,
    structArgsPath,
  };
  //    schema.args
};
