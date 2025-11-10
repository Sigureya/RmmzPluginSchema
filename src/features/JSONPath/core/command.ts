import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import type {
  ClassifiedPluginParams,
  PluginCommandSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { classifyPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import { collectScalarResults } from "./value/readStructValue";
import type { pluginValuesPath } from "./value/types/JSONPathTypes";
import type {
  CommandPath,
  StructPropertysPath,
} from "./value/types/pathSchemaTypes";
import type { PluginValues } from "./value/types/result";
import { vv } from "./value/value";

export const createCommandArgsPath = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
): CommandPath => {
  const cpp = classifyPluginParams(schema.args);
  return vv(`Command<${schema.command}>`, cpp, structMap);
};

export const collectPluginValues = (
  value: JSONValue,
  memoList: ReadonlyArray<pluginValuesPath>
): PluginValues[] => {
  return memoList.flatMap((memo): PluginValues[] => {
    const segments = memo.jsonPathJS.pathSegments(value);
    return collectScalarResults(segments, memo.schema, memo.schema.structName);
  });
};

export const buildCommandPathSchema = (
  command: CommandPath
): pluginValuesPath[] => {
  return [
    ...createSchemaJsonPathPair(command.scalars),
    ...command.structs.items.flatMap(createSchemaJsonPathPair),
    ...command.structArrays.items.flatMap(createSchemaJsonPathPair),
  ];
};

const createSchemaJsonPathPair = (
  structPath: StructPropertysPath
): pluginValuesPath[] => {
  const list = structPath.scalarArrays.map(
    (scalaArray): pluginValuesPath => ({
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
