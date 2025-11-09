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
  value: JSONValue,
  memoList: ReadonlyArray<CommandMemo>
): ScalaPathResult[] => {
  return memoList.flatMap((memo) => extractScalaResultsBySchema(value, memo));
};

const extractScalaResultsBySchema = (
  value: JSONValue,
  memo: CommandMemo
): ScalaPathResult[] => {
  const segments = memo.jsonPathJS.pathSegments(value);
  return collectScalaResults(segments, memo.schema, memo.schema.structName);
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
