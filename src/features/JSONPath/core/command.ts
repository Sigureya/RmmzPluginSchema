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
import { buildCommandPathSchema, mmm, ppp, type PPEX } from "./utils";
export interface CCCC {
  commandName: string;
  path: StructPathResult;
}

export const ccc3 = (
  schema: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): Map<string, CCCC> => {
  return new Map(
    schema.map((s): [string, CCCC] => [
      s.command,
      {
        commandName: s.command,
        path: cccc2(s, structMap),
      },
    ])
  );
};

const cccc2 = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): StructPathResult => {
  const rrrr: CommandPath = createCommandArgsPath(schema, structMap);
  return {
    items: [rrrr.scalars, ...rrrr.structs.items, ...rrrr.structArrays.items],
    errors: [...rrrr.structs.errors, ...rrrr.structArrays.errors],
  };
};

const ggg = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
) => {
  const cpp = createCommandArgsPath(schema, structMap);
  return buildCommandPathSchema(cpp);
};

const createCommandArgsPath = (
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
