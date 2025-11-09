import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import { JSONPathJS } from "jsonpath-js";
import { collectScalaResults } from "./value/paramStructRead";
import type { CommandMemo } from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
import type { ScalaPathResult } from "./value/types/result";

export const collectScalaPathResults = (
  data: JSONValue,
  ppxx: ReadonlyArray<CommandMemo>
): ScalaPathResult[] => {
  return ppxx.flatMap((ppx) => extractScalaResultsBySchema(data, ppx));
};

const extractScalaResultsBySchema = (
  value: JSONValue,
  ppaa: CommandMemo
): ScalaPathResult[] => {
  const segments = ppaa.jsonPathJS.pathSegments(value);
  return collectScalaResults(segments, ppaa.schema, ppaa.schema.structName);
};

export const buildCommandPathSchema = (command: CommandPath): CommandMemo[] => {
  return [
    ...createSchemaJsonPathPair(command.scalars),
    ...command.structs.items.flatMap(createSchemaJsonPathPair),
    ...command.structArrays.items.flatMap(createSchemaJsonPathPair),
  ];
};

const createSchemaJsonPathPair = (
  structPath: StructPropertysPath
): CommandMemo[] => {
  return structPath.scalaArrays.map(
    (scalaArray): CommandMemo => ({
      jsonPathJS: new JSONPathJS(scalaArray.path),
      schema: structPath,
    })
  );
};
