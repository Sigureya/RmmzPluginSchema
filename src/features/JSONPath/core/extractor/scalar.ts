import type {
  JSONValue,
  JSONPathReader,
} from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ScalarParam,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ExtractorBundle, PluginValueScalar } from "./types";

export const readScalarValue = <T extends ScalarParam>(
  bundle: ExtractorBundle<T, ArrayParamTypes>,
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

const vex = <T extends ScalarParam>(
  bundle: ExtractorBundle<T>,
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
    category: "struct",
    name: structName,
    value: value,
    param: { name: lastSegment, attr: schema },
  };
};
