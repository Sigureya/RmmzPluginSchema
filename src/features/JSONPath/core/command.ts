import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
  PluginParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  hasStructAttr,
  hasScalarAttr,
  isStructParam,
  isStructArrayAttr,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPathPP, eee } from "./createPath/valuePath";
import type { MemoBundle } from "./memo2/types/memo3";
import { compileJSONPathSchema } from "./pathToMemo";

const ccc = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): MemoBundle[] => {
  return schema.args.map((arg): MemoBundle => {
    const path = ppp(arg, structMap);
    return compileJSONPathSchema(path, factoryFn);
  });
};

const ppp = (
  param: PluginParam,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>
) => {
  // if (isStructArrayAttr(param)) {
  //   return createPluginValuesPathPP("param", param, structMap);
  // }
  if (hasScalarAttr(param)) {
    return eee("param", param.name, param);
  }
  throw new Error("Unsupported param type");
};
