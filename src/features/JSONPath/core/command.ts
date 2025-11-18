import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPathPP2 } from "./createPath/valuePath";
import type { MemoBundle } from "./memo2/types/memo3";
import { compileJSONPathSchema } from "./pathToMemo";

export const ccc = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): MemoBundle[] => {
  return schema.args.map((arg): MemoBundle => {
    const path = createPluginValuesPathPP2(
      "args",
      schema.command,
      arg,
      structMap
    );
    return compileJSONPathSchema(path, factoryFn);
  });
};
