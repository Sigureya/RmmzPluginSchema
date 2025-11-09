import type {
  ClassifiedPluginParams,
  PluginSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { classifyPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { px } from "./core/command";

const jsonPath = (bundle: PluginSchemaArray) => {
  const structMap = createStructMap(bundle);
  const commands = px(bundle.commands, structMap);
  return {
    commands,
    structMap,
  };
};

const createStructMap = (
  bundle: PluginSchemaArray
): Map<string, ClassifiedPluginParams> => {
  return new Map(
    bundle.structs.map((s): [string, ClassifiedPluginParams] => [
      s.struct,
      classifyPluginParams(s.params),
    ])
  );
};
