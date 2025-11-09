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
import { makeScalarParams, makeScalarArrayParams } from "./value/paramScalar";
import { collectScalarResults } from "./value/paramStructRead";
import type {
  CommandMemoItem,
  CommandMemoPair,
} from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
import type { PluginValues } from "./value/types/result";

export const createCommandMemo = (
  schema: ReadonlyArray<PluginCommandSchemaArray>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  pluginName: string
): CommandMemoPair[] => {
  return schema.map((s): CommandMemoPair => {
    const commandPath = createCommandArgsPath(s, structMap);
    return [
      `${s.command}:${pluginName}`,
      {
        commandName: s.command,
        items: buildCommandPathSchema(commandPath),
      },
    ];
  });
};

export const createCommandArgsPath = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): CommandPath => {
  const parent: string = "$";
  const cpp = classifyPluginParams(schema.args);

  const structArgsPath = getPathFromStructParam(cpp.structs, parent, structMap);
  const structArrayArgsPath = getPathFromStructArraySchema(
    cpp.structArrays,
    parent,
    structMap
  );

  const path: StructPropertysPath = {
    objectSchema: toObjectPluginParams(cpp.scalars),
    structName: `Command<${schema.command}>`,
    scalars: makeScalarParams(cpp.scalars, parent),
    scalarArrays: makeScalarArrayParams(cpp.scalarArrays, parent),
  };

  return {
    scalars: path,
    structs: structArgsPath,
    structArrays: structArrayArgsPath,
  };
};

export const collectPluginValues = (
  value: JSONValue,
  memoList: ReadonlyArray<CommandMemoItem>
): PluginValues[] => {
  return memoList.flatMap((memo): PluginValues[] => {
    const segments = memo.jsonPathJS.pathSegments(value);
    return collectScalarResults(segments, memo.schema, memo.schema.structName);
  });
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
  const list = structPath.scalarArrays.map(
    (scalaArray): CommandMemoItem => ({
      jsonPathJS: new JSONPathJS(scalaArray.path),
      schema: structPath,
    })
  );
  if (structPath.scalars) {
    list.push({
      jsonPathJS: new JSONPathJS(structPath.scalars),
      schema: structPath,
    });
  }
  return list;
};
