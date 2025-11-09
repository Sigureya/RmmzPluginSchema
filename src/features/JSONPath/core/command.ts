import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  classifyPluginParams,
  toObjectPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { buildCommandPathSchema } from "./commandMemo";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "./paramStruct";
import { makeScalaParams, makeScalaArrayParams } from "./value/paramScala";
import type { CommandMemo } from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPathResult,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
export interface CCCC {
  commandName: string;
  path: StructPathResult;
}

export const createCommandMemo = (
  schema: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): Map<string, CommandMemo[]> => {
  const list = schema.map((s): [string, CommandMemo[]] => {
    const commandPath = createCommandArgsPath(s, structMap);
    return [s.command, buildCommandPathSchema(commandPath)];
  });
  return new Map(list);
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
