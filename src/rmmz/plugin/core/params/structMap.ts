import { classifyPluginParams } from "./classify";
import type {
  ClassifiedPluginParams,
  PluginStructSchemaArray,
  PrimitiveParam,
} from "./types";

export const createClassifiedStructMap = (
  bundle: ReadonlyArray<PluginStructSchemaArray>
): Map<string, ClassifiedPluginParams> => {
  return new Map(
    bundle.map((s): [string, ClassifiedPluginParams] => [
      s.struct,
      classifyPluginParams(s.params),
    ])
  );
};

export const createStructMap = (
  structs: ReadonlyArray<PluginStructSchemaArray>
): Map<string, PrimitiveParam[]> => {
  return new Map(
    structs.map((s): [string, PrimitiveParam[]] => [
      s.struct,
      s.params.map((p) => p.attr),
    ])
  );
};
