import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import { JSONPathJS } from "jsonpath-js";
import { collectScalaResults } from "./value/paramStructRead";
import type { CommandMemoItem } from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
import type { ScalaPathResult } from "./value/types/result";

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
export const buildCommandPathSchema2 = <T>(
  command: CommandPath,
  fn: (p: StructPropertysPath) => T[]
): T[] => {
  return [
    ...fn(command.scalars),
    ...command.structs.items.flatMap(fn),
    ...command.structArrays.items.flatMap(fn),
  ];
};

export const createSchemaJsonPathPair = (
  structPath: StructPropertysPath
): CommandMemoItem[] => {
  //  structPath.scalas;

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
