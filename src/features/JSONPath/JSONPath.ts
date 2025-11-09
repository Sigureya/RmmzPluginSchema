import type { PluginSchemaArray } from "@RmmzPluginSchema/rmmz/plugin";
import { createStructMapclassifyed } from "@RmmzPluginSchema/rmmz/plugin";
import { createCommandMemo } from "./core/command";

const jsonPath = (bundle: PluginSchemaArray) => {
  const structMap = createStructMapclassifyed(bundle.structs);
  const commands = createCommandMemo(bundle.commands, structMap);
  return {
    commands,
    structMap,
  };
};
