import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { classifyPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import { createPluginValuesPath, collectScalarResults } from "./core";
import type {
  PluginValuesPath,
  PluginValuesPathMemo,
  PluginValues,
  StructPropertysPath,
} from "./core/types";

export const createCommandArgsPath = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPath => {
  const cpp = classifyPluginParams(schema.args);
  return createPluginValuesPath("command", schema.command, cpp, structMap);
};

export const collectPluginValues = (
  value: JSONValue,
  memoList: ReadonlyArray<PluginValuesPathMemo>
): PluginValues[] => {
  return memoList.flatMap((memo): PluginValues[] => {
    const segments = memo.jsonPathJS.pathSegments(value);
    return collectScalarResults(segments, memo.schema, memo.schema.structName);
  });
};

export const buildPluginValuesPathSchema = (
  command: PluginValuesPath
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
