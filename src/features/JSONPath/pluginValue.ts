import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath/JSONValue";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { classifyPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type { PluginValuesPathWithError, StructPropertysPath } from "./core";
import { createPluginValuesPath, collectScalarResults } from "./core";
import type { PluginValues } from "./core/memo2/types";
import type { PluginValuesPathMemo } from "./core/memo2/types/memo";

export const createCommandArgsPath = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathWithError => {
  const cpp = classifyPluginParams(schema.args);
  return createPluginValuesPath("command", schema.command, cpp, structMap);
};

export const createPluginParamsPath = (
  params: ReadonlyArray<PluginParam>,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): PluginValuesPathWithError[] => {
  return params.map((p) => {
    const cpp = classifyPluginParams([p]);
    return createPluginValuesPath("param", p.name, cpp, structMap);
  });
};

export const collectPluginValues = (
  value: JSONValue,
  memoList: ReadonlyArray<PluginValuesPathMemo>
): PluginValues[] => {
  return memoList.flatMap((memo): PluginValues[] => {
    const segments = memo.jsonPathJS.pathSegments(value);
    return collectScalarResults(segments, memo.schema, memo.schema.name);
  });
};
export const buildPluginValuesPathSchema2 = (
  command: ReadonlyArray<PluginValuesPathWithError>
): PluginValuesPathMemo[] => {
  return command.flatMap(buildPluginValuesPathSchema);
};

export const buildPluginValuesPathSchema = (
  command: PluginValuesPathWithError
): PluginValuesPathMemo[] => {
  const p: PluginValuesPathMemo[] = command.scalars
    ? createSchemaJsonPathPair(command.scalars)
    : [];
  return [
    ...p,
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
