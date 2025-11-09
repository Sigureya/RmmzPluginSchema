import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import { JSONPathJS } from "jsonpath-js";
import { collectScalaResults } from "./value/paramStructRead";
import type { CommandMemoItems } from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
import type { ScalaPathResult } from "./value/types/result";

export const collectScalaPathResults = (
  value: JSONValue,
  memoList: ReadonlyArray<CommandMemoItems>
): ScalaPathResult[] => {
  return memoList.flatMap((memo) => extractScalaResultsBySchema(value, memo));
};

const extractScalaResultsBySchema = (
  value: JSONValue,
  memo: CommandMemoItems
): ScalaPathResult[] => {
  const segments = memo.jsonPathJS.pathSegments(value);
  return collectScalaResults(segments, memo.schema, memo.schema.structName);
};

export const buildCommandPathSchema = (
  command: CommandPath
): CommandMemoItems[] => {
  return [
    ...createSchemaJsonPathPair(command.scalars),
    ...command.structs.items.flatMap(createSchemaJsonPathPair),
    ...command.structArrays.items.flatMap(createSchemaJsonPathPair),
  ];
};

const createSchemaJsonPathPair = (
  structPath: StructPropertysPath
): CommandMemoItems[] => {
  return structPath.scalaArrays.map(
    (scalaArray): CommandMemoItems => ({
      jsonPathJS: new JSONPathJS(scalaArray.path),
      schema: structPath,
    })
  );
};
