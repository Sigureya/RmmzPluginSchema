import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath/JSONValue";
import { JSONPathJS } from "jsonpath-js";
import type {
  PluginValuesPath2,
  StructPropertysPath,
} from "./createPath/types/pathSchemaTypes";
import type { PluginValuesPathMemo, PluginValues } from "./memo2/types";
import { collectScalarResults } from "./readStructValue";

export const collectPluginValues = (
  value: JSONValue,
  memoList: ReadonlyArray<PluginValuesPathMemo>
): PluginValues[] => {
  return memoList.flatMap((memo): PluginValues[] => {
    const segments = memo.jsonPathJS.pathSegments(value);
    return collectScalarResults(segments, memo.schema, memo.schema.name);
  });
};

export const buildPluginValuesPathSchemaV3 = (
  command: PluginValuesPath2
): PluginValuesPathMemo[] => {
  return [
    ...createSchemaJsonPathPair(command.scalars),
    ...command.structs.items.flatMap(createSchemaJsonPathPair),
    ...command.structArrays.items.flatMap(createSchemaJsonPathPair),
  ];
};

const createSchemaJsonPathPair = (
  structPath: StructPropertysPath
): PluginValuesPathMemo[] => {
  const list = structPath.scalarArrays.map(
    (scalaArray): PluginValuesPathMemo => ({
      jsonPathJS: new JSONPathJS(scalaArray.path),
      schema: structPath,
      arrays: [],
    })
  );
  if (structPath.scalars) {
    list.push({
      jsonPathJS: new JSONPathJS(structPath.scalars),
      schema: structPath,
      arrays: [],
    });
  }
  return list;
};
