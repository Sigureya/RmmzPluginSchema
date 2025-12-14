import type {
  JSONValue,
  JSONPathReader,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValuesExtractorBundle, PluginValueScalar } from "./types";

export const readScalarValue = <T extends PluginScalarParam>(
  bundle: PluginValuesExtractorBundle<T, PluginArrayParamType>,
  structName: string,
  json: JSONValue,
  jsonPath: JSONPathReader,
  record: Record<string, T>
): PluginValueScalar<T>[] => {
  return jsonPath
    .pathSegments(json)
    .map(({ value, segments }) => {
      return vex(bundle, structName, value, segments, record);
    })
    .filter((v) => v !== null);
};

const vex = <T extends PluginScalarParam>(
  bundle: PluginValuesExtractorBundle<T>,
  structName: string,
  value: JSONValue,
  segments: (number | string)[],
  record: Record<string, T>
): PluginValueScalar<T> | null => {
  if (typeof value === "object" || value === null) {
    return null;
  }
  const lastSegment = segments[segments.length - 1];
  if (typeof lastSegment === "number") {
    return null;
  }
  const schema = record[lastSegment];
  if (!schema) {
    return null;
  }
  return {
    roootName: bundle.rootName,
    rootType: bundle.rootCategory,
    structName: structName,
    value: value,
    param: { name: lastSegment, attr: schema },
  };
};
