import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginCommandSchemaArray,
  ClassifiedPluginParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { createPluginValuesPathPP2 } from "./createPath/valuePath";
import type { ExtractorBundle } from "./extractor/types";
import { compileJSONPathSchema } from "./pathToMemo";

export const ccc = (
  schema: PluginCommandSchemaArray,
  structMap: ReadonlyMap<string, ClassifiedPluginParams>,
  factoryFn: (path: string) => JSONPathReader
): ExtractorBundle[] => {
  return schema.args.map((arg): ExtractorBundle => {
    const path = createPluginValuesPathPP2(
      "args",
      schema.command,
      arg,
      structMap
    );
    return compileJSONPathSchema(path, factoryFn);
  });
};
