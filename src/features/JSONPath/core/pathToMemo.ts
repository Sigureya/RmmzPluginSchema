import { JSONPathJS } from "jsonpath-js";
import type { PathPair, PluginValuesPath } from "./createPath/types";
import type { ArrayPathMemo } from "./memo2/types";
import type { PluginValuesPathMemo4 } from "./memo2/types/memo3";

export const createMemoFromPath = (
  path: PluginValuesPath
): PluginValuesPathMemo4 => {
  const arrays: ArrayPathMemo[] = path.scalars.scalarArrays.map(xxx);
  if (path.scalars.scalars) {
    return {
      arrays: arrays,
      scalar: {
        jsonPathJS: new JSONPathJS(path.scalars.scalars),
        record: path.scalars.objectSchema,
      },
    };
  }
  return {
    arrays: arrays,
  };
};

const xxx = (path: PathPair): ArrayPathMemo => {
  return {
    jsonPathJS: new JSONPathJS(path.path),
    schema: path.param,
  };
};
