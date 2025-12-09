import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginScalarParam,
  PluginParamEx,
  StringArrayParam,
  NumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  isStringArrayParam,
  isNumberArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  PluginArrayPathExtractor2N,
  PluginArrayPathExtractor2S,
  PluginValuesArrayExN,
  PluginValuesArrayExS,
  PluginArrayPathExtractor,
  PluginValuesExtractorBundle7,
} from "./types";

export const readArrayValue = <
  NA extends NumberArrayParam,
  SA extends StringArrayParam
>(
  bundle: PluginValuesExtractorBundle7<PluginScalarParam, NA, SA>,
  groupName: string,
  json: JSONValue,
  path: PluginArrayPathExtractor<NA | SA>
): PluginValuesArrayExS<SA>[] | PluginValuesArrayExN<NA>[] => {
  const values: JSONValue = path.jsonPathJS.find(json);
  if (!Array.isArray(values)) {
    return [];
  }
  if (isNap(path)) {
    return nap(bundle, values, groupName, path.schema);
  }
  if (isSap(path)) {
    return sap(bundle, values, groupName, path.schema);
  }

  return [];
};

const isNap = <NA extends NumberArrayParam, SA extends StringArrayParam>(
  path: PluginArrayPathExtractor<NA | SA>
): path is PluginArrayPathExtractor2N<NA> => {
  return isNumberArrayParam(path.schema.attr);
};

const isSap = <NA extends NumberArrayParam, SA extends StringArrayParam>(
  path: PluginArrayPathExtractor<NA | SA>
): path is PluginArrayPathExtractor2S<SA> => {
  return isStringArrayParam(path.schema.attr);
};

const nap = <A extends NumberArrayParam>(
  bundle: PluginValuesExtractorBundle7<PluginScalarParam, A, StringArrayParam>,
  values: unknown[],
  groupName: string,
  schema: PluginParamEx<A>
): PluginValuesArrayExN<A>[] => {
  return values
    .filter((v) => typeof v === "number")
    .map(
      (v): PluginValuesArrayExN<A> => ({
        roootName: bundle.rootName,
        rootType: bundle.rootCategory,
        value: v,
        category: "struct",
        name: groupName,
        param: schema,
      })
    );
};

const sap = <A extends StringArrayParam>(
  bundle: PluginValuesExtractorBundle7<PluginScalarParam, NumberArrayParam, A>,
  values: unknown[],
  groupName: string,
  schema: PluginParamEx<A>
): PluginValuesArrayExS<A>[] => {
  return values
    .filter((v) => typeof v === "string")
    .map((v): PluginValuesArrayExS<A> => {
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
