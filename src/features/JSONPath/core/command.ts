import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  classifyPluginParams,
  toObjectPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import {
  getPathFromStructParam,
  getPathFromStructArraySchema,
} from "./paramStruct";
import { makeScalaParams, makeScalaArrayParams } from "./value/paramScala";
import { collectScalaResults } from "./value/paramStructRead";
import type { CommandMemo, CommandMemoItem } from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
import type { ScalaPathResult } from "./value/types/result";

export const createCommandMemo = (
  schema: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): Map<string, CommandMemo> => {
  const list = schema.map((s): [string, CommandMemo] => {
    const commandPath = createCommandArgsPath(s, structMap);
    return [
      s.command,
      {
        commandName: s.command,
        items: buildCommandPathSchema(commandPath),
      },
    ];
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

export const collectScalaPathResults = (
  value: JSONValue,
  memoList: ReadonlyArray<CommandMemoItem>
): ScalaPathResult[] => {
  return memoList.flatMap((memo) => extractScalaResultsBySchema(value, memo));
};

const extractScalaResultsBySchema = (
  value: JSONValue,
  memo: CommandMemoItem
): ScalaPathResult[] => {
  const segments = memo.jsonPathJS.pathSegments(value);
  return collectScalaResults(segments, memo.schema, memo.schema.structName);
};

export const buildCommandPathSchema = (
  command: CommandPath
): CommandMemoItem[] => {
  return [
    ...createSchemaJsonPathPair(command.scalars),
    ...command.structs.items.flatMap(createSchemaJsonPathPair),
    ...command.structArrays.items.flatMap(createSchemaJsonPathPair),
  ];
};

const createSchemaJsonPathPair = (
  structPath: StructPropertysPath
): CommandMemoItem[] => {
  const list = structPath.scalaArrays.map(
    (scalaArray): CommandMemoItem => ({
      jsonPathJS: new JSONPathJS(scalaArray.path),
      schema: structPath,
    })
  );
  if (structPath.scalas) {
    list.push({
      jsonPathJS: new JSONPathJS(structPath.scalas),
      schema: structPath,
    });
  }
  return list;
};
