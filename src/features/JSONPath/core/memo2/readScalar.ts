import type {
  JSONPathReader,
  JSONValue,
} from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginValueScalar, ValueCategory2 } from "./types";

export const readScalarValueV3 = (
  category: ValueCategory2,
  structName: string,
  json: JSONValue,
  jsonPath: JSONPathReader,
  record: Record<string, ScalarParam>
): PluginValueScalar[] => {
  const values = jsonPath.pathSegments(json);
  return values.reduce<PluginValueScalar[]>((acc, { value, segments }) => {
    if (typeof value === "object") {
      return acc;
    }
    const lastSegment = segments[segments.length - 1];
    if (typeof lastSegment === "number") {
      return acc;
    }
    const schema = record[lastSegment];
    if (!schema) {
      return acc;
    }
    acc.push({
      category: category,
      name: structName,
      value: value,
      param: { name: lastSegment, attr: schema },
    });
    return acc;
  }, []);
};
