import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginArrayParamType,
  PluginParamEx,
  StringArrayParam,
  NumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  isStringArrayParam,
  isNumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  PluginValuesExtractorBundle,
  PluginArrayPathExtractor,
  PluginValuesStringArray,
  PluginValuesNumberArray,
} from "./types";

export const readArrayValue = <
  T extends PluginScalarParam,
  NA extends PluginArrayParamType,
  SA extends PluginArrayParamType
>(
  bundle: PluginValuesExtractorBundle<T, NA | SA>,
  groupName: string,
  json: JSONValue,
  path: PluginArrayPathExtractor<NA>
): PluginValuesStringArray[] | PluginValuesNumberArray[] => {
  const values: JSONValue = path.jsonPathJS.find(json);
  if (!Array.isArray(values)) {
    return [];
  }
  const attr = path.schema.attr;
  if (isStringArrayParam(attr)) {
    return sap(
      bundle,
      values,
      groupName,
      path.schema as PluginParamEx<StringArrayParam>
    );
  }
  if (isNumberArrayParam(attr)) {
    return nap(
      bundle,
      values,
      groupName,
      path.schema as PluginParamEx<NumberArrayParam>
    );
  }
  return [];
};

const nap = (
  bundle: PluginValuesExtractorBundle,
  values: unknown[],
  groupName: string,
  schema: PluginParamEx<NumberArrayParam>
): PluginValuesNumberArray[] => {
  return values
    .filter((v) => typeof v === "number")
    .map(
      (v): PluginValuesNumberArray => ({
        roootName: bundle.rootName,
        rootType: bundle.rootCategory,
        value: v,
        category: "struct",
        name: groupName,
        param: schema,
      })
    );
};

const sap = (
  bundle: PluginValuesExtractorBundle,
  values: unknown[],
  groupName: string,
  schema: PluginParamEx<StringArrayParam>
): PluginValuesStringArray[] => {
  return values
    .filter((v) => typeof v === "string")
    .map((v): PluginValuesStringArray => {
      return {
        roootName: bundle.rootName,
        rootType: bundle.rootCategory,
        value: v,
        category: "struct",
        name: groupName,
        param: schema,
      };
    });
};
