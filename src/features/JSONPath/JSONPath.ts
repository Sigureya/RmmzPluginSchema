import type {
  ClassifiedPluginParams,
  PluginSchemaArray,
} from "@RmmzPluginSchema/rmmz/plugin";
import { classifyPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { ccc3 } from "./core/command";

const jsonPath = (bundle: PluginSchemaArray) => {
  const structMap = createStructMap(bundle);
  const commands = ccc3(bundle.commands, structMap);
  const c = commands.get("");
  if (c) {
  }
  return "";
};

const createStructMap = (
  bundle: PluginSchemaArray
): ReadonlyMap<string, ClassifiedPluginParams> => {
  return new Map(
    bundle.structs.map((s): [string, ClassifiedPluginParams] => [
      s.struct,
      classifyPluginParams(s.params),
    ])
  );
};
